import { getDistance, Vec2, vecTripleProduct, support } from '../../common/math';
import Simplex from './Simplex';
import Contact from './Contact';

const TOLERANCE = 0.1;
const ORIGIN = new Vec2(0, 0);

function EPA(shapeA, shapeB, simplex) {
    // console.log('EPA start', shapeA, shapeB, simplex);
    while (true) {
        let edge = simplex.getClosestEdge(ORIGIN);
        let p = support(shapeA, shapeB, edge.normal);
        let d = p.dot(edge.normal);
        if (d - edge.distance < TOLERANCE) {
            // return {
            //     normal: edge.normal,
            //     depth: d,
            //     edge: edge,
            // }
            return new Contact(shapeA, shapeB, edge, d)
        }
        else {
            simplex.insert(p, edge.index);
        }
    }
}

export default EPA;
