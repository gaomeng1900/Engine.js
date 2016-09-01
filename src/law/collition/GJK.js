
import { getDistance, Vec2, vecTripleProduct, support } from '../../common/math';

import Simplex from './Simplex';
import EPA from './EPA';
import Contact from './Contact';

function GJK (shapeA, shapeB) {
    // console.warn('START GJK =============================');
    // 闵可夫斯基差的单形
    let simplex = new Simplex();
    // window.simplex = simplex;
    // 初始化支撑点方向
    let d = new Vec2(1, 0);
    // 第一个支撑点
    simplex.add(support(shapeA, shapeB, d));
    // console.log('#0', JSON.stringify(simplex.vertexes));
    d = d.getOpp();
    while (true) {
        // console.warn('LOOP =================================== ');
        let flag = simplex.add(support(shapeA, shapeB, d));
        // simplex.draw(this.ct);
        if (simplex.getLast().dot(d) <= 0) {
            return false;
        } else {
            if (simplex.containsOrigion(d)) {
                // console.log('相交');
                return EPA(shapeA, shapeB, simplex);
            }
        }
    }
    return false;
}


export {
    GJK
}
export default GJK;
