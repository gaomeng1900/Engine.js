import {Engine} from '../../Engine.js';
import {Circle} from '../../shape/Circle';
import {Box} from '../../shape/Box';


const canvas = document.getElementById('canvas');
const ct     = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const boxA = [];
for (let i = 0; i < 4; i++) {
    let ball = new Circle(Math.random()*700, Math.random()*700, 10);
    ball.f = 0.05;
    ball.fillStyle = 'white';
    boxA.push(ball);
}


// Hand of God !!!
const hog = new Engine(canvas, 1, false, true);

// 添加实体
hog.add(boxA);

// 添加桌面边缘碰撞规则
const bound = new Box(100, 100, 1000, 550, 0.9);
const PLAY_ZONE = [100, 100, 1000, 550];
const RESTITUTION = 0.9; // 碰撞恢复系数
hog.addLaw(() => {
    hog.between(boxA, [bound]).do((A, B) => hog.useElasticCollision(A, B));
});

// 添加拖拽规则
hog.addLaw(() => {
    boxA.map(entity => hog.draftSimple(entity));
})

// 弹性网格
hog.addLaw(() => {
    hog.among(boxA).do((A, B) => {
        hog.spring(A, B, 200);
    });
})

hog.addLaw(() => {
    boxA.map(ball => ball.ay += 1);
})

// 开始运行
hog.run();
