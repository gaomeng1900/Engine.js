/**
 * 鼠标事件处理
 * 拖拽
 * 滚轮
 * 方向键
 * **所有this指向物理引擎的实例, 注意bind
 */

import { getDistance } from './math';

/**
 * 检测点是否落在边界内
 * @method ifPointIn
 * @param  {{x,y}}   point     点坐标
 * @param  {Bounds}  objBounds 边界
 * @return {Bool}
 */
function ifPointIn(point, objBounds) {
    if (objBounds.type === 'arc') { // 判断圆心距离
        return getDistance(point, objBounds) <= objBounds.radius;
    }
}

/**
 * 获取鼠标对象, 并实时更新
 * @method getCursor
 * @param  {Element}  elm 要监控的元素
 * @return {Mouse}
 */
function getCursor() {
    let elm = this.canvas;
    let mouse = {
        x:0, // 鼠标x(相对于传入元素)
        y:0, // 鼠标y(相对于传入元素)
        down:false, // 鼠标按下状态
        lockOn:null, // 鼠标点击锁定, 避免速度过快移出物体造成拖动丢失
        justClicked: false, // 用于表明鼠标刚刚点击, 还没有移动, 用于区分 内部移动 和 外部点击后 移入内部
    };
    // addEventListener 如果重复, 重复的会被自动抛弃, 不用担心多次执行
    elm.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - elm.offsetLeft)/this.scale - this.origin.x;
        mouse.y = (event.clientY + document.body.scrollTop + document.documentElement.scrollTop - elm.offsetTop)/this.scale - this.origin.y;
        mouse.justClicked = false;
    }, false);

    elm.addEventListener('mousedown', (event) => {
        mouse.down = true;
        mouse.justClicked = true;
    }, false);

    elm.addEventListener('mouseup', (event) => {
        mouse.down = false;
        mouse.lockOn = null;
        mouse.justClicked = false;
    }, false);

    elm.addEventListener('mouseout', (event) => {
        mouse.down = false;
        mouse.lockOn = null;
        mouse.justClicked = false;
    }, false);

    return mouse;
}

/**
 * 拖拽
 * *** 解决鼠标各种点击情况
 * - 点击空白然后移入
 * - 点中然后速度过快移出
 * - 移出区域
 * @param  {Base}  监控的元素
 * @param  {Fun}   拖拽发生时进行的操作
 * @param  {Bool}  点击过程中是否禁止物体移动
 */
function __draftBase(mouse, entity, move, ifCatch) {
    ifCatch = ifCatch && true;
    let ifIn = ifPointIn(mouse, entity.getBounds());
    if (ifIn && mouse.down && mouse.justClicked) {
        mouse.lockOn = entity;
        entity.__catched = ifCatch;
    }
    if (mouse.down && mouse.lockOn === entity) {
        move(entity);
    }
    else {
        entity.__catched = false;
    }
}

/**
 * 简单拖拽, 直接改变被拖拽物体的坐标
 * @method draftSimple
 * @param  {Base}  监控的实体
 */
function draftSimple(entity) {
    __draftBase(this.mouse, entity, entity => {
        entity.x = this.mouse.x;
        entity.y = this.mouse.y;
        entity.vx = this.mouse.x - entity.x;
        entity.vy = this.mouse.y - entity.y;
    }, true)
}

/**
 * 缓动拖拽(牵拉), 直接改变被拖拽物体的速度
 * @method draftEase
 * @param  {Base}  被监控实体
 * @param  {Float} 缓动系数
 */
function draftEase(entity, easing) {
    __draftBase(this.mouse, entity, entity => {
        entity.vx = (this.mouse.x - entity.x) * easing;
        entity.vy = (this.mouse.y - entity.y) * easing;
        // 辅助线降频
        if (this.ctHelperAvailable) {
            this.ct.save();
            this.ct.beginPath();
            this.ct.strokeStyle = 'red';
            this.ct.lineWidth = 1;
            this.ct.moveTo(entity.x, entity.y);
            this.ct.lineTo(this.mouse.x, this.mouse.y);
            this.ct.stroke();
            this.ct.restore();
        }
    }, false)
}

/**
 * 弹弓模型(反向拉橡皮筋)
 * @method bungee
 * @param  {Base} 被监控的实体
 * @param  {Float} 弹性系数
 * @param  {Float} 橡皮筋长度极限, 超过这个极限则不满足胡克定律
 */
function draftBungee(entity, elastane, edge) {
    __draftBase(this.mouse, entity, entity => {
        // 运动中的物体进制上弹簧
        if ((entity.vx < 0.5 && entity.vy < 0.5 && entity.ay < 0.5 && entity.ay < 0.5) || entity.__catched) {
            // 绘制弹簧和瞄准线
            // 辅助线降频
            if (this.ctHelperAvailable) {
                this.ct.save();
                this.ct.beginPath();
                this.ct.strokeStyle = '#0091EA';
                this.ct.lineWidth = 2;
                this.ct.moveTo(entity.x, entity.y);
                this.ct.lineTo(this.mouse.x, this.mouse.y);
                this.ct.stroke();
                this.ct.beginPath();
                this.ct.moveTo(entity.x, entity.y);
                this.ct.setLineDash([4, 4]); // 线段长, 空隙长
                this.ct.lineDashOffset = 0; // 起始位置偏移量
                this.ct.strokeStyle = '#2979FF';
                this.ct.lineWidth = 1;
                this.ct.lineTo(entity.x - (this.mouse.x - entity.x)*3, entity.y - (this.mouse.y - entity.y)*3);
                this.ct.stroke();
                this.ct.restore();
            }
            let len = this.getDistance(entity, this.mouse)
            if (len > edge) {
                elastane = elastane / (len/edge);
            }
            entity.vx = (entity.x - this.mouse.x) * elastane * 0.1;
            entity.vy = (entity.y - this.mouse.y) * elastane * 0.1;
        }
    }, true)
}

/**
 * 滚轮缩放
 */
function wheel() {
    this.canvas.addEventListener('wheel', event => {
        if (event.deltaY < 0) {
            this.scale *= 1.1;
            this.origin.x -= this.mouse.x * 0.1 / this.scale;
            this.origin.y -= this.mouse.y * 0.1 / this.scale;
        }
        if (event.deltaY > 0) {
            this.scale *= 0.9;
            this.origin.x += this.mouse.x * 0.1 / this.scale;
            this.origin.y += this.mouse.y * 0.1 / this.scale;
        }
    })
}

/**
 * 方向键
 */
function directionKey() {
    // 方向键的监听无法绑到元素上
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case "ArrowDown":
                this.origin.y -= 30 / this.scale;
                break;
            case "ArrowUp":
                this.origin.y += 30 / this.scale;
                break;
            case "ArrowLeft":
                this.origin.x += 30 / this.scale;
                break;
            case "ArrowRight":
                this.origin.x -= 30 / this.scale;
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    })
}

function zoomAndPan() {
    wheel.bind(this)();
    directionKey.bind(this)();
}

export {
    ifPointIn,
    getCursor,
    draftSimple,
    draftEase,
    draftBungee,
    zoomAndPan,
}
