import { getDistance, Vec2, vecTripleProduct, support } from '../../common/math';

import GJK from './GJK';
import EPA from './EPA';

// 根据接触位置(碰撞流形)的类别, 选择接触点(裁剪碰撞流形)
function contactRouter(contact) {
    let P; // 接触点
    // console.log(JSON.stringify(contact));
    if (contact.featureA.type === 'point' || contact.featureB.type === 'point') {
        // 点碰边
        // 以碰撞点作为两个物体的碰撞位置
        P = contact.featureA.type === 'point' ? contact.featureA.point : contact.featureB.point;
    }
    else {
        // 平行边相碰
        // 一个简单地剪裁方案:
        // - 四个顶点(Q,W,E,R), 任选一个
        // - 做指向另外三个点的向量
        // - 三个向量映射到这个点所在的边的方向向量上
        // - 按大小排序, 得到中间的两个点,
        // - 直接取这两个点的中心作为碰撞点 :)
        let Q = contact.featureA.a;
        let W = contact.featureA.b;
        let E = contact.featureB.a;
        let R = contact.featureB.b;
        let QW = W.sub(Q);
        let QE = E.sub(Q);
        let QR = R.sub(Q);
        let P1, P2; // 四个点中靠中间的两个点
        let w = QW.dot(QW);
        let e = QW.dot(QE);
        let r = QW.dot(QR);
        let sorted = [0, w, e, r].sort((num0, num1) => num0 - num1); // 升序
        switch (sorted[1]) {
            case 0:
                P1 = Q;
                break;
            case w:
                P1 = W;
                break;
            case e:
                P1 = E;
                break;
            case r:
                P1 = R;
                break;
            default:
                throw new Error('contact slice error! 0');
        }
        switch (sorted[2]) {
            case 0:
                throw new Error('contact slice error! 1');
                break;
            case w:
                P2 = W;
                break;
            case e:
                P2 = E;
                break;
            case r:
                P2 = R;
                break;
            default:
                throw new Error('contact slice error!');
        }
        P = new Vec2((P1.x + P2.x)/2, (P1.y + P2.y)/2);
        // console.log('P: ', P, Q, W, E, R);
    }
    // 注意: 不存在点碰点, 碰撞检测的开区间模型决定了这一点
    contactHandler(contact, P);
}

// 相对速度大于这个值则视为碰撞, 小于则视为接触, 小于零则视为正在分离
const COLLITION_THRESHOLD = 0.1;
// 相交深度大于这个值才进行位置调整, 据说可以避免抖动?
const SLOP_THRESHOLD = 0.01;

// 碰撞反馈,
// 麻烦的地方是碰撞冲量怎么计算
// ** static物体目前视为质量无限大,正常参加计算
// @TODO 特殊处理static物体, 来避免无意义的计算
// @TODO 如果出现两个static相撞需要正确处理(目前是把其中一个推开)
// @TODO 如果把碰撞过程中的物体立刻分开, 三个物体撞在一起的时候中间的物体就会来回抖动
//           如果不立即分开, 如果有重力, 就会慢慢下沉
// @NOTE 贴在表面上之所以会沉下去, 是因为, 贴着的时候由于速度很低, 是几乎没有碰撞的, 这个问题需要用力来解, 而非强行分开
function contactHandler(contact, P) {
    // 计算碰撞冲量的大小
    const A = contact.shapeA;
    const B = contact.shapeB;
    const vA1 = A.v;
    const vB1 = B.v;
    let n = contact.normal; // 碰撞(分离)向量(单位向量)(A指向B)
    let dirAB = B.centroid.sub(A.centroid);
    if (dirAB.dot(n) < 0) {
        console.log(dirAB.dot(n), dirAB, n);
    }
    let depth = contact.depth; // 碰撞深度(最短分离深度)
     // 恢复系数
    let e = 0.7;
    // 质量
    const mA = contact.shapeA.m;
    const mB = contact.shapeB.m;
    // const inv_mA = contact.shapeA.invMass;
    // const inv_mB = contact.shapeB.invMass;
    // r
    const rAP = P.sub(A.centroid);
    const rBP = P.sub(B.centroid);
    // 两个物体在碰撞点处的速度: vP = vO + ω*rOP⊥
    // @TODO 这里可以直接用标量与向量的cross product v=ω×rv=ω×r
    //       http://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-oriented-rigid-bodies--gamedev-8032
    const vAP = vA1.add(rAP.getPerp().mult(A.angularVelocity)); // 获取的垂线和角速度正方向都是顺时针的(因为y轴向下), 可能是0
    const vBP = vB1.add(rBP.getPerp().mult(B.angularVelocity)); // 获取的垂线和角速度正方向都是顺时针的(因为y轴向下), 可能是0
    const vAB = vAP.sub(vBP); // 相对速度, A上的P点相对于 B上的P点的速度, 可能是0

    const vABPerp = vAB.dot(n);
    // // 如果纵向相对速度很小, 则视为纵向相对静止, 通过减小恢复系数来减小抖动
    // // @NOTE seems not useful...
    if (vABPerp <= COLLITION_THRESHOLD) {
        e = 0.5;
    }
    // 碰撞发生
    if (vABPerp >= 0) {
        // 分子
        const jUP = -(1+e) * vAB.dot(n);
        // 分母
        const jDOWN = (n.dot(n) * (1/mA + 1/mB)) + Math.pow(rAP.perpDot(n), 2)/A.I + Math.pow(rBP.perpDot(n), 2)/B.I;
        // 冲量系数
        let j = jUP/jDOWN; // j 是负的
        // @NOTE 意外收获: 把相交深度计入碰撞冲量中, 能比较明显地减小相交, 而不会对稳定性造成较大影响
        j -= depth/2;
        // 中和掉位置保护造成的势能升高
        // if (vABPerp <= COLLITION_THRESHOLD) {
        //     j *= 1/2;
        // }
        // stability 测试
        // if (Math.abs(j) < 0.1) {
        //     j = j/2;
        // }
        // 冲量
        const pA = n.mult(j);
        const pB = n.mult(j).getOpp();


        // // Friction
        // // 合成静摩擦系数
        // let composedStaticFrictionCoe = composeFriction(A.staticFriction, B.staticFriction);
        // // 最大静摩擦力大小(碰撞力是不可求的, 这里使用的是摩擦力造成的冲量的大小 F*dt)
        // let fStatic = Math.abs(j * composedStaticFrictionCoe);
        //
        // let pfA, pfB;
        // if (vAB.isZero() || vAB.getPerp().dot(n) === 0) {
        //     console.log('zero');
        //     pfA = pfB = new Vec2(0, 0);
        // }
        // else {
        //     // 摩擦力方向
        //     let t = vecTripleProduct(n, vAB.getOpp(), n).unit();
        //     // 分子
        //     let fjUP = -(1+e) * vAB.dot(t);
        //     // 分母
        //     let fjDOWN = (t.dot(t) * (1/mA + 1/mB)) + Math.pow(rAP.perpDot(t), 2)/A.I + Math.pow(rBP.perpDot(t), 2)/B.I;
        //     // 冲量系数
        //     let fj = fjUP/fjDOWN;
        //     // let aaa = fj + 0;
        //     if (Math.abs(fj) > fStatic) {
        //         fj = fStatic;
        //         // console.log('AAA, ', fj);
        //     }
        //     else {
        //         // console.log('BBB, ', fj);
        //         // fj += 0.2;
        //     }
        //     // console.log('vAB ', vAB);
        //     // console.log('t ', t);
        //     // console.log('fjUP ', fjUP);
        //     // console.log('fjDOWN ', fjDOWN);
        //     // console.log('fj ', aaa);
        //     // console.log('fStatic ', fStatic);
        //     // console.log('n ', n);
        //     // console.log('jUP ', jUP);
        //     // console.log('jDOWN ', jDOWN);
        //     // console.log('j ', j);
        //     // console.log('-----------------------');
        //     // 冲量
        //     pfA = t.mult(fj);
        //     pfB = t.mult(fj).getOpp();
        // }
        // let tangentB = vecTripleProduct(n, vAB, n).unit();
        // let tangentA = tangentFrictionB.getOpp();

        // 改变速度和角速度
        // const vA2 = vA1.add(pA.add(pfA).mult(1/mA));
        // const vB2 = vB1.add(pB.add(pfB).mult(1/mB));
        // A.v = vA2;        // A.x += sepA.x;
        // B.v = vB2;
        // let deltaOmigaA = rAP.perpDot(pA.add(pfA)) / A.I;
        // let deltaOmigaB = rBP.perpDot(pB.add(pfB)) / B.I;
        // A.angularVelocity += deltaOmigaA;
        // B.angularVelocity += deltaOmigaB;
        const vA2 = vA1.add(pA.mult(1/mA));
        const vB2 = vB1.add(pB.mult(1/mB));
        A.v = vA2;
        B.v = vB2;
        // A.__v.push(vA2);
        // B.__v.push(vB2);
        // A.__impulse.push(pA);
        // B.__impulse.push(pB);
        let deltaOmigaA = rAP.perpDot(pA) / A.I;
        let deltaOmigaB = rBP.perpDot(pB) / B.I;
        A.angularVelocity += deltaOmigaA;
        B.angularVelocity += deltaOmigaB;

        // 抗抖动测试:
        // #1 防止重力的干扰
        // @NOTE 理论基础: 碰撞力远大于其它力, 发生碰撞时可以不再考虑其它作用力
        //       效果显著? => 似乎失败了
        // A.a.set(0, 0);
        // B.a.set(0, 0);
        //

        // console.log('#253', j);
        // #3 模拟一个冲量来进行推开操作
    }
    // else if (vABPerp <= COLLITION_THRESHOLD) {
    //
    // }
    // 正在分离
    else {
    }
    // @NOTE 这样的话多个物体同时碰撞, 中间的物体必然会行为怪异
    // 立刻把这两个分开
    // @TEST 使用渗透阈值测试抗抖动
    //       似乎并没有什么用
    // if (depth > SLOP_THRESHOLD) {
        const sep = n.mult(depth); // 加一个百分比来减小抖动
        let sepA = sep.mult(mB / (mA + mB)).getOpp();
        let sepB = sep.mult(mA / (mA + mB));
        // 这里, 质量无限大的情况需要单独处理
        if (mA === Infinity) {
            sepA = new Vec2(0, 0);
            sepB = sep;
        }
        if (mB === Infinity) {
            sepA = sep.getOpp();
            sepB = new Vec2(0, 0);
        }
        // A.pos = A.pos.add(sepA);
        // B.pos = B.pos.add(sepB);
        // #2 插值抗抖动
        // @NOTE 记录一轮中所有的位置校准建议, 最后把这些建议综合起来执行
        //       似乎失败了
        //       似乎生效了...... damn it
        // if (sepA.y > 0) {
        //     sepA.y = 0
        // }
        // if (sepB.y > 0) {
        //     sepB.y = 0
        // }
        A.__posProtection.push(sepA);
        B.__posProtection.push(sepB);

        // let j = -depth * 10;
        // if (j < -10) {
        //     j = -10;
        // }

        // let j = -4;
        //
        // const pA = n.mult(j);
        // const pB = n.mult(j).getOpp();
        //
        // const vA2 = vA1.add(pA.mult(1/mA));
        // const vB2 = vB1.add(pB.mult(1/mB));
        // A.a = A.a.add(pA.mult(1/mA));
        // B.a = B.a.add(pB.mult(1/mB));
        //
        // let deltaOmigaA = rAP.perpDot(pA) / A.I;
        // let deltaOmigaB = rBP.perpDot(pB) / B.I;
        // A.angularVelocity += deltaOmigaA;
        // B.angularVelocity += deltaOmigaB;
    // }

    // 位置校准的困境: 直接推来推去不能用来校准多面夹击的情况,
    //                 而碰撞反馈的速度又和碰前相对速度有关
    //                 如果碰前基本相对静止, 加上误差之后就基本上没有反馈速度了
    //                 因此额外加上一个分离速度, 只和相交深度?以及质量?有关
    // 用于位置校准的反馈加速度
    // @RESULT 似乎失败了
    // let posAceA = n.getOpp().mult(B.m / (A.m + B.m));
    // let posAceB = n.mult(A.m / (A.m + B.m));
    // if (A.m === Infinity) {
    //     posAceA = new Vec2(0, 0);
    //     posAceB = n;
    // }
    // if (B.m === Infinity) {
    //     posAceB = new Vec2(0, 0);
    //     posAceA = n.getOpp();
    // }
    // posAceA = posAceA.mult(1/5);
    // posAceB = posAceB.mult(1/5);
    // A.a = A.a.add(posAceA);
    // B.a = B.a.add(posAceB);
}

function composeFriction(fA, fB) {
    return Math.sqrt(Math.pow(fA, 2), Math.pow(fB, 2));
}

function useElasticCollision(A, B) {
    let contact = GJK.bind(this)(A, B);
    if (contact) {
        // contact.draw(this.ct);
        // contactHandler(contact);
        contactRouter(contact);
    }
    // contact && contact.draw(this.ct);
    // console.log(contact);
}

export {
    useElasticCollision
}
export default useElasticCollision;
