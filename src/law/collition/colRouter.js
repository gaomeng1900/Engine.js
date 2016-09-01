/**
 * 根据两个物体的shape来选择碰撞模型
 */

import * as circleCircle from './circleCircle';
import * as circleBox from './circleBox';
import * as polygonPolygon from './polygonPolygon';

/**
 * 弹性碰撞模型
 * 符合动量守恒/动能守恒的任意角度弹性碰撞模型
 * - 副作用: 直接修改传入实体的vx,vy属性
 * @method elasticImpact
 * @param  {Base}      A
 * @param  {Base}      B
 */
function useElasticCollision(A, B) {
    // let typeA = A.getBounds().type;
    // let typeB = B.getBounds().type;
    // if (typeA === 'arc' && typeB === 'arc') {
    //     circleCircle.useElasticCollision.bind(this)(A, B);
    // }
    // else if ((typeA === 'arc' && typeB === 'box') || (typeA === 'box' && typeB === 'arc')) {
    //     circleBox.useElasticCollision.bind(this)(A, B);
    // }
    // else if (typeA === 'polygon' && typeB === 'polygon') {
        polygonPolygon.useElasticCollision.bind(this)(A, B);
    // }
}

/**
 * 非弹性碰撞
 */

function userPICollision(A, B) {
    let typeA = A.getBounds().type;
    let typeB = B.getBounds().type;
    if (typeA === 'arc' && typeB === 'arc') {
        circleCircle.userPICollision.bind(this)(A, B);
    }
}

export {
    useElasticCollision,
    userPICollision,
}
