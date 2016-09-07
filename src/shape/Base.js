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

        this.__posProtection = []; // 位置校准建议
        this.__posHis = [];
        this.__v = [];
        this.__angularVelocity = [];

        this.__impulse = [];
    }

    move(freq = 1) {
        // 位置校准
        if (this.__posProtection.length > 0) {
            const posArbit = this.__posProtection.reduce((pre, cur) => pre.add(cur), new Vec2()).mult(1/this.__posProtection.length);
            // console.log('#56666', posArbit);
            // if (posArbit.y > 0) {
            //     console.log(posArbit);
            //     posArbit.y = 0;
            // }
            this.pos = this.pos.add(posArbit.mult(1/3));
            // if (posArbit.getMod() > 2) {
            //     this.__posHis = [];
            // }
            // this.__posHis.unshift(posArbit);
            // this.pos = this.pos.add(this.__posHis.reduce((pre, cur) => pre.add(cur), new Vec2()).mult(1/(this.__posHis.length + 1)));
            // this.__posHis = this.__posHis.slice(0, 10);
            this.__posProtection = [];
        }
        // // 碰撞反馈: 冲量
        // if (this.__v.length > 0) {
        //     const vArbit = this.__v.reduce((pre, cur) => pre.add(cur), new Vec2()).mult(1/this.__v.length);
        //     // console.log('#56666', posArbit);
        //     this.v = vArbit;
        //     this.__v = [];
        // }
        // if (this.__impulse.length > 0) {
        //     const impulseArbit = this.__impulse.reduce((pre, cur) => pre.add(cur), new Vec2()).mult(1/this.__impulse.length);
        //     this.v = this.v.add(impulseArbit.mult(1/this.m));
        //     this.__impulse = [];
        // }
        // 加速度
        this.v.x += this.a.x / freq;
        this.v.y += this.a.y / freq;
        // 阻尼
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
