/**
 * 物理引擎
 * @author Simon
 * @create 2016-08-12
 */

import { Base } from './shape/Base';
import { Circle } from './shape/Circle';
import { Box } from './shape/Box';

import { ifPointIn, getCursor, draftSimple, draftEase, draftBungee, zoomAndPan } from './common/mouse';
import { between, among } from './common/traverse';
import { autoFreq } from './common/tool';
import { GJK } from './law/collition/GJK';

import { useElasticCollision, userPICollision } from './law/collition/colRouter';
import { spring } from './law/hooke';
import { uGrav } from './law/gravity';

class Engine {
    /**
     * 构造函数
     * @method constructor
     * @param  {Element}       canvas       图层canvas元素
     * @param  {[Int]}         samsaraCount 每帧的轮回数, 默认为1
     * @param  {[Bool|String]} autoFreqMode 动态调频模式 false|'turbo'|'balance', default:'balance'
     * @param  {[Bool]}        wheel        是够监听鼠标滚轮和方向键, 进行缩放和移动
     */
    constructor(canvas, samsaraCount=1, autoFreqMode='balance', zoomRpan=true) {
        // 主图层
        this.canvas = canvas;
        this.ct = canvas.getContext('2d');
        // 辅助线专用图层 ** 辅助线绘制单独开一个图层性能不好, 已取消
        this.ctHelperAvailable = true; // 用于降低辅助线图层的刷新率, 以免拖慢整体刷新率

        // 每帧的轮回数
        this.samsaraCount = samsaraCount;
        this.maxSamsaraCount = samsaraCount;

        // 自动调频/性能监控
        this.autoFreqMode = autoFreqMode;
        this._bufferFrameCycle = [];
        this._bufferFunCycle = [];
        this._autoFreqTimmer = 0;
        this._frameTimestamp = 0;

        // 初始化
        this.entities = [];
        this.groups = [];
        this._onRun = false;
        this._timmer = 0;
        this.laws = [];
        this.mouse = getCursor.bind(this)();
        this.origin = {x: 0, y: 0};
        this.scale = 1;

        // 滚轮缩放和方向键平移
        if (zoomRpan) {
            zoomAndPan.bind(this)();
        }

        /**
         * 添加函数
         */
        this.draftSimple = draftSimple.bind(this);
        this.draftEase = draftEase.bind(this);
        this.draftBungee = draftBungee.bind(this);
        this.between = between.bind(this);
        this.among = among.bind(this);
        this.useElasticCollision = useElasticCollision.bind(this);
        this.userPICollision = userPICollision.bind(this);
        this.spring = spring.bind(this);
        this.uGrav = uGrav.bind(this);
        this.autoFreq = autoFreq.bind(this);
        this.GJK = GJK.bind(this);
    }

    /**
     * 向当前画布添加 实体
     * - 参数为实体对象构成的数组
     * - 副作用: 参数被加上'__GUID'属性
     * @method add
     * @param  {Array(Base)} ent 要添加的实体列表
     */
    add(...ents) {
        ents.map(ent => {
            this.groups.push(ent)
            this.entities = this.entities.concat(ent);
        });
    }

    /**
     * 删除被标记为dead的实体
     * - 副作用: 直接修改了上面add的传入值
     * @method clean
     */
    clean() {
        this.groups.map(group => {
            let toDel = group.map((entity, index) => entity.dead ? index : false).filter(key => key !== false);
            toDel.length > 0 && toDel.sort((a, b) => b - a);
            toDel.map(index => group.splice(index, 1));
        })
        this.entities = this.groups.reduce((pre, cur) => pre.concat(cur), []);
    }

    /**
     * 开始运行
     * @method run
     */
    run() {
        // 轮回 !!!
        const samsara = () => {
            let entities = this.entities;
            // 1. 运行物理定律
            // 1.1 a=F/m, F是瞬时的, 如果物理定律中没有其他影响, a应该立即置0
            entities.map(entity => entity.a.set(0, 0));
            // 1.2 执行所有注册了的物理定律/游戏规则
            this.laws.map(law => {
                law();
            });
            // 2. 执行每个实体自己的动作
            entities.map(entity => {
                if (entity.behavior) {
                    entity.behavior(this.samsaraCount);
                }
            });
            // 3. 执行运动
            entities.map(entity => {
                if (!entity.__catched) {
                    entity.move(this.samsaraCount);
                }
            });
            // * 辅助线降频, 控制辅助线每帧只绘制一次, 以免影响性能
            this.ctHelperAvailable = false;
        }

        // 帧
        const frame = () => {
            // 4. 动画
            this.timmer = window.requestAnimationFrame(frame);
            // * 帧率监控
            let now = new Date().getTime();
            let frameCycle = now - this._frameTimestamp;
            this._frameTimestamp = now;
            // 1. 绘制当前实体
            this.ct.save();

            // 1.1.a 拖影效果
            // this.ct.fillStyle = 'rgba(0, 0, 0, 0.1)';
            // this.ct.fillRect(0, 0, this.canvas.width, this.canvas.height);
            // 1.1.b 无拖影效果
            this.ct.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // 1.2 使全局缩放和偏移生效
            this.ct.scale(this.scale, this.scale);
            this.ct.translate(this.origin.x, this.origin.y);
            // 1.3 绘制add过的所有实体
            this.entities.map(entity => entity.draw(this.ct));
            // 2. 执行轮回
            this.ctHelperAvailable = true; // 辅助线降频
            for (let i = 0; i < this.samsaraCount; i++) {
                // try {
                    samsara();
                // } catch (e) {
                //     this.stop();
                //     throw e;
                // }
            }
            // 3. 自动调频
            this.autoFreq(frameCycle);
            this.ct.restore();
        }
        this.timmer = window.requestAnimationFrame(frame);
        // this.timmer = window.setInterval(frame, 5);
    }

    stop() {
        window.cancelAnimationFrame(this.timmer);
    }
    step() {
        this.run();
        this.stop();
    }

    /**
     * 添加物理定律
     * 在每个轮回(每一帧)运行
     * @method addLaw
     */
    addLaw(law) {
        this.laws.push(law);
    }
}

// ES6中没有静态属性(ES7中有, 但是chrome目前无法直接支持)
Engine.Base = Base;
Engine.Circle = Circle;
Engine.Box = Box;

export { Engine }

// Engine.Group = class Group {
//     constructor() {
//         this.array = [];
//         this.__GUID = Engine.__getID();
//     }
//
//     push(entity) {
//         this.array.push(entity);
//     }
//     shift(entity) {
//         this.array.shift(entity);
//     }
//     unshift(entity) {
//         this.array.unshift(entity);
//     }
//
//     getArray() {
//         return this.array.filter(ent => !ent.dead);
//     }
//
//     clean() {
//         this.array = this.array.filter(ent => !ent.dead);
//     }
// }
