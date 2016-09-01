/**
 * 万有引力定律
 * @method uGrav
 * @param  {[type]} A 物体
 * @param  {[type]} B 物体
 * @param  {[type]} G 万有引力常数, 需要自行校准
 */

import { getDistance } from '../common/math';

function uGrav(A, B, G) {
    let r = getDistance(A, B);
    r = r === 0 ? 0.01 : r;
    // console.log(r);
    if (!r) {
        console.log(r);
        error;
    }
    // 对A
    let unitVectorA = {
        x: (B.x - A.x) / r,
        y: (B.y - A.y) / r
    }
    let Fabx = G * A.m * B.m / Math.pow(r, 2) * unitVectorA.x;
    let Faby = G * A.m * B.m / Math.pow(r, 2) * unitVectorA.y;
    A.a.x += Fabx / A.m;
    A.a.y += Faby / A.m;
    // 对B
    let unitVectorB = {
        x: -unitVectorA.x,
        y: -unitVectorA.y
    }
    let Fbax = G * A.m * B.m / Math.pow(r, 2) * unitVectorB.x;
    let Fbay = G * A.m * B.m / Math.pow(r, 2) * unitVectorB.y;
    B.a.x += Fbax / B.m;
    B.a.y += Fbay / B.m;

    if (this.ctHelperAvailable) {
        this.ct.save();
        this.ct.strokeStyle = 'red';
        this.ct.lineWidth = 0.05 + 100/r;
        this.ct.beginPath();
        this.ct.moveTo(A.pos.x, A.pos.y);
        this.ct.lineTo(B.pos.x, B.pos.y);
        this.ct.stroke();
        this.ct.restore();
    }
}

export {uGrav}
