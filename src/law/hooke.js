import { getDistance } from '../common/math';

function spring(A, B, fixDis) {
    let dis = getDistance(A, B);
    let offset = dis - fixDis;
    let theta = Math.atan2(B.pos.y - A.pos.y, B.pos.x - A.pos.x);
    let beta = Math.atan2(A.pos.y - B.pos.y, A.pos.x - B.pos.x);
    A.a.x += Math.cos(theta) * offset / 15;
    A.a.y += Math.sin(theta) * offset / 15;
    B.a.x += Math.cos(beta) * offset / 15;
    B.a.y += Math.sin(beta) * offset / 15;

    if (this.ctHelperAvailable) {
        this.ct.save();
        this.ct.moveTo(A.pos.x, A.pos.y);
        this.ct.lineTo(B.pos.x, B.pos.y);
        this.ct.strokeStyle = 'white';
        this.ct.stroke();
        this.ct.restore();
    }
}


export {
    spring,
}
