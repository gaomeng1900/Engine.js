/**
 * 数学计算
 */

/**
 * 获取两点距离
 * @method getDistance
 * @param  {{x,y}}    A点
 * @param  {{x,y}}    B点
 * @return {Float}    距离
 */
function getDistance(A, B) {
    return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
}

/**
 * 二维向量
 */
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.info = {}; // 直接把生成信息带到向量里, 就是这么diao
    }
    // 取模
    getMod() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    // 获取反向
    getOpp() {
        return new Vec2(-this.x, -this.y);
    }
    // 获取垂线 (顺时针)
    getPerp() {
        if (this.isZero()) {
            console.warn('零向量取法线, something might be wrong');
        }
        return new Vec2(-this.y, this.x);
    }
    // 乘积
    product(n) {
        return new Vec2(this.x * n, this.y * n);
    }
    mult(n) {
        return new Vec2(this.x * n, this.y * n);
    }
    // 点积
    dot(b) {
        return this.x * b.x + this.y * b.y;
    }
    // 垂直点乘
    perpDot(b) {
        let res = this.getPerp().dot(b);
        // 取正
        // if (res < 0) {
        //     res = -res;
        // }
        return res
    }
    //  向量加
    add(b) {
        return new Vec2(this.x + b.x, this.y + b.y);
    }
    // 向量减
    sub(b) {
        return new Vec2(this.x - b.x, this.y - b.y);
    }
    // 判断相等
    equal(b) {
        return this.x === b.x && this.y && b.y;
    }
    // 修改
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    // 化为单位向量
    unit() {
        let mod = this.getMod();
        // console.log('mod', mod);
        if (mod === 0) {
            throw new Error('无法化为单位向量: ', JSON.stringify(this));
        }
        return this.mult(1/mod);
    }
    // 判断是否零向量
    isZero() {
        return this.x === 0 && this.y === 0;
    }
    // 旋转
    // - 旋转方向为从x正方向转向y正方向, 如果y朝下, 则为顺时针
    rotate(deg, o) {
        let len = this.sub(o).getMod();
        // console.log(len, this.x, this.y);
        let α = Math.atan2(this.y - o.y, this.x - o.x);
        let β = α + deg;
        // console.log(α, len * Math.cos(β), len * Math.sin(β));
        this.x = o.x + len * Math.cos(β);
        this.y = o.y + len * Math.sin(β);
    }
}

// 向量三重积
// @NOTE A x B x A 能方便的计算A在B方向的法线, 但是可能会等于0, 需要做单独判断
//       如果只是需要一个法线, 而不需要方向的话, A.getPerp() 不会返回0向量
function vecTripleProduct (a, b, c) {
    // a * b * c = -a(c . b) + b(c . a)
    // console.log('三重积', a, b, c, b.product(c.dot(a)).sub(a.product(c.dot(b))));
    // console.log('#001', c.dot(a), b.product(c.dot(a)), c.dot(b), a.product(c.dot(b)));
    return b.mult(c.dot(a)).sub(a.mult(c.dot(b)));
}

// 根据方向获取闵可夫斯基差的支撑点
function support(shapeA, shapeB, dir) {
    let pA = shapeA.getFarthest(dir);
    let pB = shapeB.getFarthest(dir.getOpp());
    // console.log('support: ', dir, pA, pB, pA.sub(pB));
    let support = pA.sub(pB);
    support.info.pair = {
        A: pA,
        B: pB,
    }
    // console.log(support);
    return support;
}

// 点线距
function getDisPointLine(p, a, b) {
    // 线向量
    let ab = b.sub(a);
    // 点到端点的向量
    let pa = a.sub(p);
    // 点到线的垂线
    let n = vecTripleProduct(ab, pa, ab);
    if (n.isZero()) {return 0};
    n = n.unit();
    // 距离
    let d = n.dot(a);
    return d;
}

export {
    getDistance,
    Vec2,
    vecTripleProduct,
    support,
    getDisPointLine,
};

// export default {
//     getDistance,
//     Vec2,
//     vecTripleProduct,
// }
