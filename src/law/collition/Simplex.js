// 单形

import { getDistance, Vec2, vecTripleProduct, support } from '../../common/math';

class Simplex {
    constructor() {
        this.vertexes = []; // 储存顶点
    }
    draw(ct) {
        ct.save();
        ct.beginPath();
        ct.moveTo(this.vertexes[0].x, this.vertexes[0].y);
        for (let i = 1; i < this.vertexes.length; i++) {
            ct.lineTo(this.vertexes[i].x, this.vertexes[i].y);
        }
        ct.closePath();
        ct.strokeStyle = 'red';
        ct.lineWidth = 4;
        ct.stroke();
        // ct.fill();
        ct.restore();
    }
    add(ver) {
        // console.log('add', ver);
        // let flag = true;
        // this.vertexes.map(vec => {
        //     if (vec.equal(ver)) {
        //         console.error('添加重复顶点', vec);
        //         // flag = false;
        //     }
        // })
        // this.remove(ver);
        // if (flag) {
        this.vertexes.push(ver);
            // return true;
        // }
        // else {
            // return 1100;
        // }
    }
    insert(ver, index, pair) {
        this.vertexes.splice(index, 0, ver);
    }
    remove(b) {
        // console.log('remove', b);
        this.vertexes = this.vertexes.filter(ver => !ver.equal(b));
    }
    getLast() {
        return this.vertexes[this.vertexes.length - 1];
    }
    containsOrigion(d) {
        // console.log('containsOrigion: ', d);
        let a = this.getLast();
        let ao = a.getOpp();
        if (this.vertexes.length === 3) {
            let b = this.vertexes[1];
            let c = this.vertexes[0];
            let ab = b.sub(a);
            let ac = c.sub(a);
            let abPerp = vecTripleProduct(ac, ab, ab);
            let acPerp = vecTripleProduct(ab, ac, ac);
            // console.log('#9', a, b, c, ab, ac, abPerp, acPerp);
            if (abPerp.dot(ao) > 0) {
                this.remove(c);
                // console.log('#4', d);
                d.set(abPerp.x, abPerp.y);
                // console.log('#5', d);
            }
            else {
                if (acPerp.dot(ao) > 0) {
                    this.remove(b);
                    // console.log('#6', d);
                    d.set(acPerp.x, acPerp.y);
                    // console.log('#7', d);
                }
                else {
                    return true;
                }
            }
        }
        else {
            let b = this.vertexes[0];
            let ab = b.sub(a);
            let abPerp = vecTripleProduct(ab, ao, ab);
            // 这里ab有可能直接过原点, 然后得到abPerp为0向量, 会导致后面无法化为单位向量
            if (abPerp.isZero()) {
                // console.log('#23:', b, a, ab, abPerp);
                return true;
            }
            d.set(abPerp.x, abPerp.y);
        }
        return false;
    }

    getClosestEdge(p) {
        // console.log('getClosestEdge', p);
        let edge = {
            distance: Number.POSITIVE_INFINITY,
            index: 0,
            normal: 0,
            a: null,
            b: null,
        }
        for (let i = 0; i < this.vertexes.length; i++) {
            // console.log('LOOP');
            let j = (i + 1 == this.vertexes.length) ? 0 : i + 1;
            let a = this.vertexes[i];
            let b = this.vertexes[j];
            // let d = getDisPointLine(p, a, b);
            // 线向量
            let ab = b.sub(a);
            // // 点到端点的向量
            // let pa = a.sub(p);
            // // 点到线的垂线
            // let n = vecTripleProduct(ab, pa, ab);
            // console.log('#0', n);
            // if (n.isZero()) {
            //     edge.distance = 0;
            //     edge.index = j;
            //     edge.normal = n;
            //     return edge;
            // };
            // 相距很近的时候, 三重积会因为精度问题返回0, 导致后面无法计算,
            let n = ab.getPerp();
            n = n.unit();
            // console.log('#1', n);
            // 距离
            let d = n.dot(a);
            // console.log('#2', d);

            if(d < edge.distance) {
                edge.distance = d;
                edge.index = j;
                edge.normal = n;
                edge.a = a;
                edge.b = b;
            }
        }
        return edge;
    }
}

export default Simplex;
