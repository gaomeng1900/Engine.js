import {Engine} from '../../Engine.js';
import {Circle} from '../../shape/Circle';
import {Box} from '../../shape/Box';
import Polygon from '../../shape/Polygon';

import { getDistance, Vec2, vecTripleProduct } from '../../common/math';

const canvas = document.getElementById('canvas');
const ct     = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let versA = [
    new Vec2(0,0),
    new Vec2(120,0),
    new Vec2(80,70),
    new Vec2(40,90),
]
let shapeA = new Polygon(versA, new Vec2(200, 50), new Vec2(60, 35));
shapeA.v = new Vec2(0, 3 + 2 * Math.random());
shapeA.I = 20000;
shapeA.m = 25;
shapeA.angularVelocity = 0.1 * Math.random();
let versB = [
    new Vec2(40,0),
    new Vec2(80,0),
    new Vec2(80,70),
    new Vec2(0,70),
]
let shapeB = new Polygon(versB, new Vec2(200, 250), new Vec2(40, 35));
shapeB.v = new Vec2(0, -5 + -2 * Math.random());
shapeB.I = 10000;
shapeB.m = 20;
shapeB.angularVelocity = 0.05 + 0.1 * Math.random();
// shapeB.setStatic();

let shapeC = new Circle(new Vec2(100, 150), 70);
shapeC.m = 30;
shapeC.strokeStyle = 'white';
shapeC.angularVelocity = 0;
shapeC.I = 7000;
shapeC.v = new Vec2(5, -1);

let shapeD = new Circle(new Vec2(70, 150), 70);
shapeD.m = 30;
shapeD.strokeStyle = 'white';
shapeD.angularVelocity = 0;
shapeD.I = 7000;
shapeD.v = new Vec2(5, -1);

let shapeE = new Circle(new Vec2(150, 150), 70);
shapeE.m = 30;
shapeE.strokeStyle = 'white';
shapeE.angularVelocity = 0;
shapeE.I = 7000;
shapeE.v = new Vec2(5, -1);

// wrapper
const wrapper = [];
let wrapperA = [
    new Vec2(0,0),
    new Vec2(10,0),
    new Vec2(10,500),
    new Vec2(0,500),
]
let wrapperB = [
    new Vec2(0,0),
    new Vec2(500,0),
    new Vec2(500,10),
    new Vec2(0,10),
]
let wLeft = new Polygon(wrapperA, new Vec2(0, 0), new Vec2(5, 250));
wLeft.setStatic();
let wRight = new Polygon(wrapperA, new Vec2(500, 0), new Vec2(5, 250));
wRight.setStatic();
let wBtm = new Polygon(wrapperB, new Vec2(0, 500), new Vec2(250, 5));
wBtm.setStatic();
let wTop = new Polygon(wrapperB, new Vec2(0, 0), new Vec2(250, 5));
wTop.setStatic();

// Hand of God !!!
const hog = new Engine(canvas, 5, false, true);
hog.scale = 0.7;
hog.origin.x = 300;
hog.origin.y = 300;

// 添加实体
hog.add([shapeA, shapeB, shapeC, shapeD, shapeE, wLeft, wRight, wBtm, wTop]);

hog.addLaw(() => {
    hog.among([shapeA, shapeB, shapeC, shapeD, shapeE]).do((A, B) => hog.useElasticCollision(A, B));
    hog.between([shapeA, shapeB, shapeC, shapeD, shapeE], [wLeft, wRight, wBtm, wTop]).do((A, B) => hog.useElasticCollision(A, B));
    [shapeA, shapeB, shapeC, shapeD, shapeE].map(entity => entity.a.y = 0.1);
    // [shapeC].map(entity => hog.draftEase(entity));
})



// 开始运行
hog.run();

window.hog = hog;
