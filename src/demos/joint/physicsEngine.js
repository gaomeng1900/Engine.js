/**
 * 物理引擎
 * @author Simon
 * @create 2016-08-12
 */

 /**
  * 基类(虚基类)
  * @author Simon
  * @create 2016-08-09
  */


class Engine {
    /**
     * 构造函数
     * @method constructor
     * @param  {Element}       canvas       图层canvas元素
     * @param  {[Int]}         samsaraCount 每帧的轮回数, 默认为1
     * @param  {[Bool|String]} autoFreqMode 动态调频模式 false|'turbo'|'balance', default:'balance'
     * @param  {[Bool]}        wheel        是够监听鼠标滚轮和方向键, 进行缩放和移动
     */
    constructor(canvas, samsaraCount=1, autoFreqMode='balance', wheel=true) {
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
        this.mouse = this.getCursor(canvas);
        this.origin = {x: 0, y: 0};
        this.scale = 1;

        // 监听鼠标滚轮和方向键
        if (wheel) {
            document.addEventListener('wheel', event => {
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

    }

    /**
     * 向当前画布添加 实体
     * - 实体须继承自Base
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
            entities.map(entity => entity.ax = entity.ay = 0);
            // 1.2 执行所有注册了的物理定律/游戏规则
            this.laws.map(law => {
                law();
            });
            // 2. 执行每个实体自己的动作
            entities.map(entity => entity.action || entity.action());
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
                samsara();
            }
            // 3. 自动调频
            this.autoFreq(frameCycle);
            this.ct.restore();
            // 4. 动画
            this.timmer = window.requestAnimationFrame(frame);
        }
        this.timmer = window.requestAnimationFrame(frame);
        // this.timmer = window.setInterval(frame, 5);
    }

    /**
     * 添加物理定律
     * 在每个轮回(每一帧)运行
     * @method addLaw
     */
    addLaw(law) {
        this.laws.push(law);
    }



    /**
     * 关系 ============================================================
     */

    /**
     * 两组实体之间的关系(实体组内部无关系)
     * 链式调用: between([arrayOfBase, Base], [Base]).when((A, B)=>{if...}).do((A, B)=>{do...})
     * @method between
     * @param  {Array(Array|Base)} setsA
     * @param  {Array(Array|Base)} setsB
     */
    between(setsA, setsB) {
        let entitiesA = setsA.reduce((a, b) => a.concat(b), []);
        let entitiesB = setsB.reduce((a, b) => a.concat(b), []);
        return {
            do: (funcDo) => {
                this._travBetween(entitiesA, entitiesB, funcDo);
            },
            when: (funcWhen) => {
                return {
                    do: (funcDo) => {
                        this._travBetween(entitiesA, entitiesB, (A, B) => {
                            if (funcWhen(A, B)) {
                                funcDo(A, B);
                            }
                        });
                    }
                }
            }
        }
    }
    /**
     * 实体之间的关系
     * @method among
     * @param  {Array(Base)|Base} ...sets
     */
    among(...sets) {
        let entities = sets.reduce((a, b) => a.concat(b));
        return {
            do: (funcDo) => {
                this._travAmong(entities, funcDo);
            },
            when: (funcWhen) => {
                return {
                    do: (funcDo) => {
                        this._travAmong(entities, (A, B) => {
                            if (funcWhen(A, B)) {
                                funcDo(A, B);
                            }
                        });
                    }
                }
            }
        }
    }


    _travBetween(entitiesA, entitiesB, func) {
        for (let i = 0; i < entitiesA.length; i++) {
            let entity = entitiesA[i];
            for (let j = 0; j < entitiesB.length; j++) {
                let nextEntity = entitiesB[j];
                func(entity, nextEntity);
            }
        }
    }
    _travAmong(entities, func) {
        for (let i = 0; i < entities.length - 1; i++) {
            let entity = entities[i];
            for (let j = i + 1; j < entities.length; j++) {
                let nextEntity = entities[j];
                func(entity, nextEntity);
            }
        }
    }


    /**
     * 两个实体之间的碰撞检测
     * @method ifCollide
     * @param  {Bounds}  objBounds0 A物体的边界
     * @param  {Bounds}  objBounds1 B物体的边界
     * @return {Bool}
     */
    ifCollide (A, B) {
        // 针对圆形的碰撞检测
        let boundsA = A.getBounds();
        let boundsB = B.getBounds();
        if (boundsA.type === 'arc' && boundsB.type === 'arc') { // 判断圆心距离
            let colli = Math.sqrt(
                        Math.pow(boundsA.x - boundsB.x, 2) +
                        Math.pow(boundsA.y - boundsB.y, 2)
                    ) <= boundsA.radius + boundsB.radius;
            // 画出碰撞辅助线
            if (this.ctHelperAvailable && colli) {
                this.ct.save();
                this.ct.beginPath();
                this.ct.moveTo(A.x, A.y);
                this.ct.strokeStyle = 'green';
                this.ct.lineWidth = 1;
                this.ct.lineTo(B.x, B.y);
                this.ct.stroke();
                this.ct.restore();
            }
            return colli;
        }
    }


    /**
     * 若A和B相交, 则直接调整两者位置, 以退回相切的位置
     * - 副作用: 直接修改传入实体的x,y属性
     * @method noCross
     */
    noCross(A, B) {
        let distance = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
        // 针对圆形的位置调整
        if (A.getBounds().type === 'arc' && B.getBounds().type === 'arc') {
            if (A.radius + B.radius > distance) {
                // 重合了
                // 辅助线降频
                if (this.ctHelperAvailable) {
                    this.ct.save();
                    this.ct.beginPath();
                    this.ct.moveTo(A.x, A.y);
                    this.ct.strokeStyle = 'yellow';
                    this.ct.lineWidth = 1;
                    this.ct.lineTo(B.x, B.y);
                    this.ct.stroke();
                    this.ct.restore();
                }

                let central = {
                    x: (A.x * A.radius + B.x * B.radius) / (A.radius + B.radius),
                    y: (A.y * A.radius + B.y * B.radius) / (A.radius + B.radius) ,
                }
                // 需要移动的距离, 先不考虑两个球移动的距离应该不同
                let d = (A.radius + B.radius - distance) / 2;
                // 夹角
                let beta = Math.atan2(B.y - A.y, B.x - A.x);
                let dx = Math.cos(beta) * d;
                let dy = Math.sin(beta) * d;
                A.x -= dx * 1.05;
                A.y -= dy * 1.05;
                B.x += dx * 1.05;
                B.y += dy * 1.05;
            }
        }
    }

    /**
     * 弹性碰撞模型
     * 符合动量守恒/动能守恒的任意角度弹性碰撞模型
     * - 副作用: 直接修改传入实体的vx,vy属性
     * @method elasticImpact
     * @param  {Base}      A
     * @param  {Base}      B
     */
    elasticImpact(A, B) {
        let typeA = A.getBounds().type;
        let typeB = B.getBounds().type;
        if (typeA === 'arc' && typeB === 'arc') {
            this.__elasticImpactArcArc(A, B);
        }
        else if ((typeA === 'arc' && typeB === 'bound') || (typeA === 'bound' && typeB === 'arc')) {
            this.__elasticImpactArcBound(A, B);
        }
    }

    /**
     * 弹性碰撞, 两个圆形相碰
     * @method __elasticImpactArcArc
     * @param  {[type]}              A [description]
     * @param  {[type]}              B [description]
     * @return {[type]}                [description]
     */
    __elasticImpactArcArc(A, B) {
        // ** 连线方向正碰
        // 连线方向矢量
        const X = [B.x - A.x, B.y - A.y];
        const lenX = Math.sqrt(Math.pow(X[0], 2) + Math.pow(X[1], 2)); // 连线向量长度
        // 连线方向上的速度
        let vAX = ((A.vx*X[0] + 0*X[1]) / lenX) + ((0*X[0] + A.vy*X[1]) / lenX);
        let vBX = ((B.vx*X[0] + 0*X[1]) / lenX) + ((0*X[0] + B.vy*X[1]) / lenX);
        let vAXN = ((A.m - B.m) * vAX + 2 * B.m * vBX) / (A.m + B.m);
        let vBXN = (2 * A.m * vAX + (B.m - A.m) * vBX) / (A.m + B.m);
        // ** 切面方向v不变
        // 切线方向矢量
        let Y = [1, -X[0]/X[1]]; // 随便设一个, 垂直就好
        // ---- 这里有个坑: 切线可能垂直(lenY = Infinity)
        let lenY = Math.sqrt(Math.pow(Y[0], 2) + Math.pow(Y[1], 2)); // 切线向量长度
        if (lenY > 99999999) {
            lenY = 1;
            Y = [0, 1];
        };
        // 切线方向上的速度
        let vAY = ((A.vx*Y[0] + 0*Y[1]) / lenY) + ((0*Y[0] + A.vy*Y[1]) / lenY);
        let vBY = ((B.vx*Y[0] + 0*Y[1]) / lenY) + ((0*Y[0] + B.vy*Y[1]) / lenY);
        // ** 合成新速度
        // 连线方向上的新速度是标量, 方向与X相同, 现在映射到x, y上
        const oX = Math.atan2(X[1], X[0]);// 连线与x轴的夹角
        const oY = Math.atan2(Y[1], Y[0]);// 切线与x轴的夹角
        let mapxA = vAXN * Math.cos(oX) + vAY * Math.cos(oY);
        let mapyA = vAXN * Math.sin(oX) + vAY * Math.sin(oY); // 正负问题?
        let mapxB = vBXN * Math.cos(oX) + vBY * Math.cos(oY);
        let mapyB = vBXN * Math.sin(oX) + vBY * Math.sin(oY); // 正负问题?

        if (isNaN(mapxA+mapyA+mapxB+mapyB)) {
            throw new Error('速度合成结果有问题');
        }

        A.vx = isNaN(mapxA) ? 0 : mapxA;
        A.vy = isNaN(mapyA) ? 0 : mapyA;
        B.vx = isNaN(mapxB) ? 0 : mapxB;
        B.vy = isNaN(mapyB) ? 0 : mapyB;
    }

    /**
     * 圆形与碰撞边界相碰
     * - A和B之间一个为arc一个为bound
     * @method __elasticImpactArcBound
     * @param  {[type]}                A [description]
     * @param  {[type]}                B [description]
     * @return {[type]}                  [description]
     */
    __elasticImpactArcBound(A, B) {
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
        if (ball.x + ball.radius >= zone[2]) {
            ball.vx = -ball.vx * restitution;
            ball.ax = -ball.ax;
            ball.x = zone[2] - ball.radius; // 立刻退回区域内, 暂时不按原路径退回
        }
        if (ball.x - ball.radius <= zone[0]) {
            ball.vx = -ball.vx * restitution;
            ball.ax = -ball.ax;
            ball.x = zone[0] + ball.radius; // 立刻退回区域内, 暂时不按原路径退回
        }
        if (ball.y + ball.radius >= zone[3]) {
            ball.vy = -ball.vy * restitution;
            ball.ay = -ball.ay;
            ball.y = zone[3] - ball.radius; // 立刻退回区域内, 暂时不按原路径退回
        }
        if (ball.y - ball.radius <= zone[1]) {
            ball.vy = -ball.vy * restitution;
            ball.ay = -ball.ay;
            ball.y = zone[1] + ball.radius; // 立刻退回区域内, 暂时不按原路径退回
        }
    }


    /**
     * 完全非弹性碰撞模型
     * Perfectly inelastic collision
     * - 副作用: 直接修改传入A, B的vx,vy,m属性, 执行传入B的析构方法
     * @method pICollision
     * @param  {Base}      A
     * @param  {Base}      B
     */
    pICollision(A, B, merge) {
        let main, sub;
        if (A.m >= B.m) {
            main = A;
            sub  = B;
        }
        else {
            main = B;
            sub  = A;
        }
        let newM = A.m + B.m; // 合成物体的质量
        newM = newM || 0.0001; // 避免质量为零下面出现NaN
        let newVx = (A.vx * A.m + B.vx * B.m) / newM;
        let newVy = (A.vy * A.m + B.vy * B.m) / newM;

        main.vx = newVx;
        main.vy = newVy;
        sub.destory();
    }

    /**
     * 将两物体的尺寸融合
     * - 副作用: 修改传入元素中非dead元素的尺寸和位置
     * @method sizeMerge
     * @param  {[type]}  A [description]
     * @param  {[type]}  B [description]
     */
    sizeMerge(A, B) {
        // console.log(this.entities.reduce((pre, cur) => {
        //     return pre + cur.m;
        // }, 0));
        let main, sub;
        if (A.m >= B.m) {
            main = A; sub  = B;
        }
        else {
            main = B; sub  = A;
        }

        if (main.getBounds().type === 'arc' && sub.getBounds().type === 'arc') {
            main.radius = Math.sqrt(Math.pow(main.radius, 2) + Math.pow(sub.radius, 2));
            sub.radius = 0;
            main.m += sub.m;
            sub.m = 0;
            main.x += (sub.x - main.x) * sub.radius / (sub.radius + main.radius);
            main.y += (sub.y - main.y) * sub.radius / (sub.radius + main.radius);
        }
    }

    /**
     * 万有引力定律
     * @method uGrav
     * @param  {[type]} A 物体
     * @param  {[type]} B 物体
     * @param  {[type]} G 万有引力常数, 需要自行校准
     */
    uGrav(A, B, G) {
        let r = this.getDistance(A, B);
        r = r === 0 ? 0.01 : r;
        // console.log(r);
        if (!r) {
            console.log(r);
            error;
        }
        // 对A
        let unitVectorA = {
            x: (B.x - A.x) / r,
            y: (B.y - A.y) / r
        }
        let Fabx = G * A.m * B.m / Math.pow(r, 2) * unitVectorA.x;
        let Faby = G * A.m * B.m / Math.pow(r, 2) * unitVectorA.y;
        A.ax += Fabx / A.m;
        A.ay += Faby / A.m;
        // 对B
        let unitVectorB = {
            x: -unitVectorA.x,
            y: -unitVectorA.y
        }
        let Fbax = G * A.m * B.m / Math.pow(r, 2) * unitVectorB.x;
        let Fbay = G * A.m * B.m / Math.pow(r, 2) * unitVectorB.y;
        B.ax += Fbax / B.m;
        B.ay += Fbay / B.m;

        if (this.ctHelperAvailable) {
            this.ct.save();
            this.ct.strokeStyle = 'red';
            this.ct.lineWidth = 0.05 + 100/r;
            this.ct.beginPath();
            this.ct.moveTo(A.x, A.y);
            this.ct.lineTo(B.x, B.y);
            this.ct.stroke();
            this.ct.restore();
        }
    }

    joint(A, B, fixDis) {
        let dis = hog.getDistance(A, B);
        let offset = dis - fixDis;
        let theta = Math.atan2(B.y - A.y, B.x - A.x);
        let beta = Math.atan2(A.y - B.y, A.x - B.x);
        A.ax += Math.cos(theta) * offset / 15;
        A.ay += Math.sin(theta) * offset / 15;
        B.ax += Math.cos(beta) * offset / 15;
        B.ay += Math.sin(beta) * offset / 15;

        if (this.ctHelperAvailable) {
            this.ct.save();
            this.ct.moveTo(A.x, A.y);
            this.ct.lineTo(B.x, B.y);
            this.ct.strokeStyle = 'white';
            this.ct.stroke();
            this.ct.restore();
        }
    }

    /**
     * 检测点是否落在边界内
     * @method ifPointIn
     * @param  {{x,y}}   point     点坐标
     * @param  {Bounds}  objBounds 边界
     * @return {Bool}
     */
    ifPointIn(point, objBounds) {
        if (objBounds.type === 'arc') { // 判断圆心距离
            return this.getDistance(point, objBounds) <= objBounds.radius;
        }
    }

    /**
     * 获取鼠标对象, 并实时更新
     * @method getCursor
     * @param  {Element}  elm 要监控的元素
     * @return {Mouse}
     */
    getCursor(elm) {
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
    __draftBase(entity, move, ifCatch) {
        ifCatch = ifCatch && true;
        let ifIn = this.ifPointIn(this.mouse, entity.getBounds());
        if (ifIn && this.mouse.down && this.mouse.justClicked) {
            this.mouse.lockOn = entity;
            entity.__catched = ifCatch;
        }
        if (this.mouse.down && this.mouse.lockOn === entity) {
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
    draftSimple(entity) {
        this.__draftBase(entity, entity => {
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
    draftEase(entity, easing) {
        this.__draftBase(entity, entity => {
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
    bungee(entity, elastane, edge) {
        this.__draftBase(entity, entity => {
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
     * 获取两点距离
     * @method getDistance
     * @param  {{x,y}}    A点
     * @param  {{x,y}}    B点
     * @return {Float}    距离
     */
    getDistance(A, B) {
        return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
    }

    /**
     * 生成简化的GUID
     * @method __getID
     * @return {String}
     */
    static __getID() {
        let d = new Date().getTime();
        return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
    };

    /**
     * 自动调频
     * @method optFreq
     * @param  {Float} newFreq 新周期
     */
    autoFreq(frameCycle) {
        // 高精度模式
        if (this.autoFreqMode === 'turbo') {
            let endTime = new Date().getTime();

            if (this._autoFreqTimmer > 30) {
                let oldSam = this.samsaraCount;
                this._autoFreqTimmer = 0;
                // if (this._bufferFunCycle.reduce((pre, cur) => pre + cur) / 30 < 8.5) {
                //     this.samsaraCount += 10;
                // }

                let av = this._bufferFrameCycle.reduce((pre, cur) => pre + cur) / 30;
                if (av < 18) {
                    this.samsaraCount += 5;
                }
                if (av > 18) {
                    this.samsaraCount = 1 + this.samsaraCount * 0.8;
                }
                // this.entities.map(entity => {
                //     entity.vx *= oldSam / this.samsaraCount;
                // })

                // console.log('每帧', oldSam, '个轮回');
                // console.log('用时', endTime - this._frameTimestamp, '毫秒');
                // console.log('帧周期', frameCycle, '毫秒');
                // console.log('调频: ', this.samsaraCount);
                // console.log('---------------------------');
            }

            this._bufferFunCycle[this._autoFreqTimmer] = endTime - this._frameTimestamp;
            this._bufferFrameCycle[this._autoFreqTimmer] = frameCycle;
            this._autoFreqTimmer += 1;
        }

        // 平衡模式
        if (this.autoFreqMode === 'balance') {
            let vMax = this.entities.reduce((pre, cur) => {
                let approximateV = Math.sqrt(Math.pow(cur.vx, 2) + Math.pow(cur.vy, 2));
                if (approximateV > pre) {
                    return approximateV
                } else {return pre}
            }, 0.5)
            this.samsaraCount =  Math.floor(vMax * 2);
            // console.log(this.samsaraCount);
        }
    }
}

// ES6中没有静态属性(ES7中有, 但是chrome目前无法直接支持)
/**
 * 基类(虚基类)
 * @author Simon
 * @create 2016-08-09
 */
Engine.Base = class Base {
    constructor(x, y) {
        this.x  = x;
        this.y  = y;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.f  = 0; // 摩擦力
        this.spring = 0.5; // 弹性
        // this.free   = true; // 按照自己的v/a自由运动
        this.scale  = 1; // 缩放比例
        this.rotate = 0; // 旋转角度
        this.fillStyle   = 'rgba(0, 0, 0, 0)'; // 填充颜色
        this.strokeStyle = 'rgba(0, 0, 0, 1)'; // 描边颜色
        // this.playYard  = PLAY_ZONE ; // 活动区域
        this.m = 1; // 质量
        this.dead = false; // 为true证明可以清理了
        this.__GUID = Engine.__getID();
    }

    move(freq = 1) {
        // 加速度
        this.vx += this.ax / freq;
        this.vy += this.ay / freq;
        // 摩擦力
        this.vx *= 1 - this.f / freq;
        this.vy *= 1 - this.f / freq;
        // 移动
        this.x += this.vx / freq;
        this.y += this.vy / freq;
    }

    draw() {/**/}
    getBounds() {/**/}
    destory() {this.dead = true}
    action() {/**/}
}

Engine.Bound = class Bound extends Engine.Base {
    constructor(x1, x2, y1, y2, restitution) {
        super(0, 0);
        this.zone = [x1, x2, y1, y2];
        this.restitution = restitution;
    }

    getBounds() {
        return {
            type: 'bound',
            zone: this.zone,
            restitution: this.restitution,
        }
    }
}

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
