/**
 * 两个Circle之间的碰撞检测
 * @method ifCollide
 * @param  {Bounds}  objBounds0 A物体的边界
 * @param  {Bounds}  objBounds1 B物体的边界
 * @return {Bool}
 */
function ifCollide (A, B) {
    // 针对圆形的碰撞检测
    let boundsA = A.getBounds();
    let boundsB = B.getBounds();
    let colli = Math.sqrt(
                    Math.pow(boundsA.x - boundsB.x, 2) +
                    Math.pow(boundsA.y - boundsB.y, 2)
                ) <= boundsA.radius + boundsB.radius;
    // 画出碰撞辅助线
    if (this.ctHelperAvailable && colli) {
        this.ct.save();
        this.ct.beginPath();
        this.ct.moveTo(A.pos.x, A.pos.y);
        this.ct.strokeStyle = 'green';
        this.ct.lineWidth = 1;
        this.ct.lineTo(B.pos.x, B.pos.y);
        this.ct.stroke();
        this.ct.restore();
    }
    return colli;

}


/**
 * Circle相交回退
 * 若A和B相交, 则直接调整两者位置, 以退回相切的位置
 * @method noCross
 */
function noCross(A, B) {
    let distance = Math.sqrt(Math.pow(B.pos.x - A.pos.x, 2) + Math.pow(B.pos.y - A.pos.y, 2));
    // 针对圆形的位置调整
    if (A.radius + B.radius > distance) {
        // 重合了
        // 辅助线降频
        if (this.ctHelperAvailable) {
            this.ct.save();
            this.ct.beginPath();
            this.ct.moveTo(A.pos.x, A.pos.y);
            this.ct.strokeStyle = 'yellow';
            this.ct.lineWidth = 1;
            this.ct.lineTo(B.pos.x, B.pos.y);
            this.ct.stroke();
            this.ct.restore();
        }

        let central = {
            x: (A.pos.x * A.radius + B.pos.x * B.radius) / (A.radius + B.radius),
            y: (A.pos.y * A.radius + B.pos.y * B.radius) / (A.radius + B.radius),
        }
        // 需要移动的距离, 先不考虑两个球移动的距离应该不同
        let d = (A.radius + B.radius - distance) / 2;
        // 夹角
        let beta = Math.atan2(B.pos.y - A.pos.y, B.pos.x - A.pos.x);
        let dx = Math.cos(beta) * d;
        let dy = Math.sin(beta) * d;
        A.pos.x -= dx * 1.05;
        A.pos.y -= dy * 1.05;
        B.pos.x += dx * 1.05;
        B.pos.y += dy * 1.05;
    }
}


/**
 * Circle弹性碰撞
 * @method elasticImpactArcArc
 * @param  {[type]}              A [description]
 * @param  {[type]}              B [description]
 */
function elasticCollision(A, B) {
    // ** 连线方向正碰
    // 连线方向矢量
    const X = [B.pos.x - A.pos.x, B.pos.y - A.pos.y];
    const lenX = Math.sqrt(Math.pow(X[0], 2) + Math.pow(X[1], 2)); // 连线向量长度
    // 连线方向上的速度
    let vAX = ((A.v.x*X[0] + 0*X[1]) / lenX) + ((0*X[0] + A.v.y*X[1]) / lenX);
    let vBX = ((B.v.x*X[0] + 0*X[1]) / lenX) + ((0*X[0] + B.v.y*X[1]) / lenX);
    let vAXN = ((A.m - B.m) * vAX + 2 * B.m * vBX) / (A.m + B.m);
    let vBXN = (2 * A.m * vAX + (B.m - A.m) * vBX) / (A.m + B.m);
    // ** 切面方向v不变
    // 切线方向矢量
    let Y = [1, -X[0]/X[1]]; // 随便设一个, 垂直就好
    // ---- 这里有个坑: 切线可能垂直(lenY = Infinity)
    let lenY = Math.sqrt(Math.pow(Y[0], 2) + Math.pow(Y[1], 2)); // 切线向量长度
    if (lenY > 99999999) {
        lenY = 1;
        Y = [0, 1];
    };
    // 切线方向上的速度
    let vAY = ((A.v.x*Y[0] + 0*Y[1]) / lenY) + ((0*Y[0] + A.v.y*Y[1]) / lenY);
    let vBY = ((B.v.x*Y[0] + 0*Y[1]) / lenY) + ((0*Y[0] + B.v.y*Y[1]) / lenY);
    // ** 合成新速度
    // 连线方向上的新速度是标量, 方向与X相同, 现在映射到x, y上
    const oX = Math.atan2(X[1], X[0]);// 连线与x轴的夹角
    const oY = Math.atan2(Y[1], Y[0]);// 切线与x轴的夹角
    let mapxA = vAXN * Math.cos(oX) + vAY * Math.cos(oY);
    let mapyA = vAXN * Math.sin(oX) + vAY * Math.sin(oY); // 正负问题?
    let mapxB = vBXN * Math.cos(oX) + vBY * Math.cos(oY);
    let mapyB = vBXN * Math.sin(oX) + vBY * Math.sin(oY); // 正负问题?

    if (isNaN(mapxA+mapyA+mapxB+mapyB)) {
        throw new Error('速度合成结果有问题');
    }

    A.v.x = isNaN(mapxA) ? 0 : mapxA;
    A.v.y = isNaN(mapyA) ? 0 : mapyA;
    B.v.x = isNaN(mapxB) ? 0 : mapxB;
    B.v.y = isNaN(mapyB) ? 0 : mapyB;
}


/**
 * 综合弹性碰撞
 * - 碰撞检测
 * - 相交回退
 * - 碰撞模型计算
 * @method useElasticCollision
 * @param  {[type]}            A [description]
 * @param  {[type]}            B [description]
 */
function useElasticCollision(A, B, callback) {
    if (ifCollide(A, B)) {
        noCross(A, B);
        elasticCollision(A, B);
        callback(A, B);
    }
}



/**
 * Circle完全非弹性碰撞模型
 * Perfectly inelastic collision
 * @method pICollision
 * @param  {Base}      A
 * @param  {Base}      B
 */
function pICollision(A, B) {
    let main, sub;
    if (A.m >= B.m) {
        main = A;
        sub  = B;
    }
    else {
        main = B;
        sub  = A;
    }
    let newM = A.m + B.m; // 合成物体的质量
    newM = newM || 0.0001; // 避免质量为零下面出现NaN
    let newVx = (A.v.x * A.m + B.v.x * B.m) / newM;
    let newVy = (A.v.y * A.m + B.v.y * B.m) / newM;

    main.v.x = newVx;
    main.v.y = newVy;
    sub.destory();
}

/**
 * Circle融合
 * @method sizeMerge
 * @param  {[type]}  A [description]
 * @param  {[type]}  B [description]
 */
function sizeMerge(A, B) {
    let main, sub;
    if (A.m >= B.m) {
        main = A; sub  = B;
    }
    else {
        main = B; sub  = A;
    }

    if (main.getBounds().type === 'arc' && sub.getBounds().type === 'arc') {
        main.radius = Math.sqrt(Math.pow(main.radius, 2) + Math.pow(sub.radius, 2));
        sub.radius = 0;
        main.m += sub.m;
        sub.m = 0;
        main.pos.x += (sub.pos.x - main.pos.x) * sub.radius / (sub.radius + main.radius);
        main.pos.y += (sub.pos.y - main.pos.y) * sub.radius / (sub.radius + main.radius);
    }
}

/**
 * 综合完全非弹性碰撞
 * - 碰撞检测
 * - 完全非弹性模型
 * - 尺寸合并
 * @method usePICollision
 * @param  {[type]}       A        [description]
 * @param  {[type]}       B        [description]
 * @param  {Function}     callback [description]
 */
function usePICollision(A, B, callback) {
    if (ifCollide(A, B)) {
        pICollision(A, B);
        sizeMerge(A, B);
    }
}


export {
    ifCollide,
    noCross,
    elasticCollision,
    pICollision,
    sizeMerge,
    useElasticCollision,
    usePICollision,
}
