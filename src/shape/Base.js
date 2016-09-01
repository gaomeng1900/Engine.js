/**
 * 基类(虚基类)
 * @author Simon
 * @create 2016-08-09
 */

import { getDistance, Vec2, vecTripleProduct, getDisPointLine } from '../common/math';
import {getID} from '../common/tool';

export class Base {
    constructor(pos) {
        this.pos = pos;
        this.v = new Vec2(0, 0);
        this.a = new Vec2(0, 0);
        // this.x  = x;
        // this.y  = y;
        // this.vx = 0;
        // this.vy = 0;
        // this.ax = 0;
        // this.ay = 0;
        this.f  = 0; // 摩擦力
        this.spring = 0.5; // 弹性
        // this.free   = true; // 按照自己的v/a自由运动
        this.scale  = 1; // 缩放比例
        this.rotate = 0; // 旋转角度
        this.fillStyle   = 'rgba(0, 0, 0, 0)'; // 填充颜色
        this.strokeStyle = 'rgba(0, 0, 0, 1)'; // 描边颜色
        // this.playYard  = PLAY_ZONE ; // 活动区域
        this.m = 1; // 质量
        this.angularVelocity = 0;
        this.dead = false; // 为true证明可以清理了
        this.__GUID = getID();
    }

    move(freq = 1) {
        // 加速度
        this.v.x += this.a.x / freq;
        this.v.y += this.a.y / freq;
        // 摩擦力
        this.v.x *= 1 - this.f / freq;
        this.v.y *= 1 - this.f / freq;
        // 移动
        this.pos.x += this.v.x / freq;
        this.pos.y += this.v.y / freq;
    }

    draw() {/**/}
    getBounds() {/**/}
    destory() {this.dead = true}
    action() {/**/}
}
