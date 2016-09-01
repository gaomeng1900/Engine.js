/**
 * 圆形与碰撞边界相碰
 * - A和B之间一个为arc一个为bound
 * @method __elasticImpactArcBound
 * @param  {[type]}                A [description]
 * @param  {[type]}                B [description]
 * @return {[type]}                  [description]
 */
function useElasticCollision(A, B) {
    let ball, zone, restitution;
    let boundA = A.getBounds();
    let boundB = B.getBounds();
    if (boundA.type === 'arc') {
        ball = A;
        zone = boundB.zone;
        restitution = boundB.restitution;
    }
    else {
        ball = B;
        zone = boundA.zone;
        restitution = boundA.restitution;
    }
    if (ball.pos.x + ball.radius >= zone[2]) {
        ball.v.x = -ball.v.x * restitution;
        ball.a.x = -ball.a.x;
        ball.pos.x = zone[2] - ball.radius; // 立刻退回区域内, 暂时不按原路径退回
    }
    if (ball.pos.x - ball.radius <= zone[0]) {
        ball.v.x = -ball.v.x * restitution;
        ball.a.x = -ball.a.x;
        ball.pos.x = zone[0] + ball.radius; // 立刻退回区域内, 暂时不按原路径退回
    }
    if (ball.pos.y + ball.radius >= zone[3]) {
        ball.v.y = -ball.v.y * restitution;
        ball.a.y = -ball.a.y;
        ball.pos.y = zone[3] - ball.radius; // 立刻退回区域内, 暂时不按原路径退回
    }
    if (ball.pos.y - ball.radius <= zone[1]) {
        ball.v.y = -ball.v.y * restitution;
        ball.a.y = -ball.a.y;
        ball.pos.y = zone[1] + ball.radius; // 立刻退回区域内, 暂时不按原路径退回
    }
}

export {
    useElasticCollision,
}
