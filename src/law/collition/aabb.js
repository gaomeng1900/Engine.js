/**
 * 检查AABB盒是否相交
 */

export default function checkAABB(A, B) {
    boxA = A.getAABB();
    boxB = B.getAABB();
    // y负, y正, x负, x正 (正常坐标系的下上左右, canvas坐标系的上下左右)
    // @Princeple
    //     boxB 至少两个边在A的对应两边之内
    let checkBtm = boxB[0] <= boxA[1] && boxB[0] >= boxA[0];
    let checkTop = boxB[1] <= boxA[1] && boxB[1] >= boxA[0];
    let checkL = boxB[2] <= boxA[3] && boxB[2] >= boxA[2];
    let checkR = boxB[3] <= boxA[3] && boxB[3] >= boxA[2];
    return (checkBtm + checkTop + checkL + checkR) > 1;
}
