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

        // 四个方向上的最远点, 用于生成AABB盒
        this._btmPoint = {}; // y负方向, canvas朝上
        this._topPoint = {}; // y正方向, canvas朝下
        this._lPoint = {};
        this._rPoint = {};
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
        this._btmPoint = this.getFarthest(new Vec2(0, -1));
        this._topPoint = this.getFarthest(new Vec2(0, 1));
        this._lPoint = this.getFarthest(new Vec2(-1, 0));
        this._rPoint = this.getFarthest(new Vec2(1, 0));
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

    // setMass(m) {
    //     this.mass = m;
    //     this.invMass = 1/m;
    // }

    setStatic() {
        this.m = Infinity;
        this.I = Infinity;
        this.v.x = this.v.y = 0;
        this.a.x = this.a.y = 0;
        this.angularVelocity = 0;
        this.static = true;
        this.move = ()=>{};
    }

    getBounds() {
        return {
            type: 'polygon'
        }
    }

    destory() {
        this.dead = true;
    }

    getAABB() {
        // y负, y正, x负, x正 (正常坐标系的下上左右, canvas坐标系的上下左右)
        // @NOTE: 为什吗四个最远点可以缓存而不可以缓存位置,
        //        因为最远点只会在旋转发生时变化, 而位置可能在每一次碰撞求解时都被调整
        return [this.pos.y - this._btmPoint.y,
                this.pos.y + this._topPoint.y,
                this.pos.x - this._lPoint.x,
                this.pos.x + this._rPoint.x]
    }


}

export default Polygon;
