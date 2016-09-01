/**
 * 多边形
 */

import { getDistance, Vec2, vecTripleProduct, getDisPointLine } from '../common/math';
import {Base} from './Base';

class Polygon extends Base{
    constructor(vertexes, pos, centroid) {
        super(pos);
        this.vertexesLocal = vertexes;
        this.centroidLocal = centroid;
        this.vertexes = [];
        this.centroid = new Vec2(0, 0);
        this.behavior(1);
        this.I = 1; // 转动惯量, @TODO 计算转动惯量
    }

    draw(ct) {
        ct.save();
        ct.beginPath();
        ct.moveTo(this.vertexes[0].x, this.vertexes[0].y);
        for (let i = 1; i < this.vertexes.length; i++) {
            ct.lineTo(this.vertexes[i].x, this.vertexes[i].y);
        }
        ct.closePath();
        ct.strokeStyle = 'white';
        ct.stroke();
        ct.beginPath();
        ct.arc(this.centroid.x, this.centroid.y, 5, 0, Math.PI * 2);
        ct.fillStyle = 'blue';
        ct.fill();
        // ct.fill();
        ct.restore();
    }
    behavior(samsaraCount) {
        // 更新中心
        this.centroid.x = this.centroidLocal.x + this.pos.x;
        this.centroid.y = this.centroidLocal.y + this.pos.y;
        // 更新顶点
        this.vertexesLocal.map(ver => ver.rotate(this.angularVelocity / samsaraCount, this.centroidLocal));
        this.vertexes = this.vertexesLocal.map(ver => new Vec2(ver.x + this.pos.x, ver.y + this.pos.y));
    }

    getFarthest(directiion) {
        // 投影长度 (节约计算, 不除direction.mod())
        let projections = this.vertexes.map(ver => directiion.dot(ver));
        // console.log(JSON.stringify(projections));
        // 找到最大值的index
        let max = projections[0], index = 0;
        for (let i = 1; i < projections.length; i++) {
            if(projections[i] > max) {
                max = projections[i];
                index = i;
            }
        }
        // console.log('max:', index);
        return this.vertexes[index];
    }

    setStatic() {
        this.m = Infinity;
        this.I = Infinity;
        this.v.x = this.v.y = 0;
        this.a.x = this.a.y = 0;
        this.angularVelocity = 0;
        this.static = true;
    }

    getBounds() {
        return {
            type: 'polygon'
        }
    }
    destory() {
        this.dead = true;
    }
}

export default Polygon;
