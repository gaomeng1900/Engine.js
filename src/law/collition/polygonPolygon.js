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
const COLLITION_THRESHOLD = 1;

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
    // n 到底是指向哪里的??
    let dirAB = B.centroid.sub(A.centroid);
    if (dirAB.dot(n) < 0) {
        console.log(dirAB.dot(n), dirAB, n);
    }
    let depth = contact.depth; // 碰撞深度(最短分离深度)
     // 恢复系数
    let e = 0.8;
    // 质量
    const mA = contact.shapeA.m;
    const mB = contact.shapeB.m;
    // r
    const rAP = P.sub(A.centroid);
    const rBP = P.sub(B.centroid);
    // 两个物体在碰撞点处的速度: vP = vO + ω*rOP⊥
    const vAP = vA1.add(rAP.getPerp().mult(A.angularVelocity)); // 获取的垂线和角速度正方向都是顺时针的(因为y轴向下)
    const vBP = vB1.add(rBP.getPerp().mult(B.angularVelocity)); // 获取的垂线和角速度正方向都是顺时针的(因为y轴向下)
    const vAB = vAP.sub(vBP);

    const vABPerp = vAB.dot(n);
    // 如果纵向相对速度很小, 则视为纵向相对静止, 通过减小恢复系数来避免震动
    if (vABPerp <= COLLITION_THRESHOLD) {
        e = 0.3;
    }
    // 碰撞发生
    if (vABPerp >= 0) {
        // 分子
        const jUP = -(1+e) * vAB.dot(n);
        // 分母
        const jDOWN = (n.dot(n) * (1/mA + 1/mB)) + Math.pow(rAP.perpDot(n), 2)/A.I + Math.pow(rBP.perpDot(n), 2)/B.I;
        // 冲量系数
        const j = jUP/jDOWN;
        // 冲量
        const pA = n.mult(j);
        const pB = n.mult(j).getOpp();
        // 改变速度和角速度
        const vA2 = vA1.add(pA.mult(1/mA));
        const vB2 = vB1.add(pB.mult(1/mB));
        A.v = vA2;        // A.x += sepA.x;
        // A.y += sepA.y;
        // B.x += sepB.x;
        // B.y += sepB.y;
        B.v = vB2;
        let deltaOmigaA = rAP.perpDot(pA) / A.I;
        let deltaOmigaB = rBP.perpDot(pB) / B.I;
        A.angularVelocity += deltaOmigaA;
        B.angularVelocity += deltaOmigaB;

        // @NOTE 这样的话多个物体同时碰撞, 中间的物体必然会行为怪异
        // 立刻把这两个分开
        const sep = n.mult(depth / 2);
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
        A.pos = A.pos.add(sepA);
        B.pos = B.pos.add(sepB);
    }
    // else if (vABPerp <= COLLITION_THRESHOLD) {
    //
    // }
    // 正在分离
    else {
        // 立刻把这两个分开
        const sep = n.mult(depth / 2);
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
        A.pos = A.pos.add(sepA);
        B.pos = B.pos.add(sepB);
    }
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
