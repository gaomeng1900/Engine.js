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
shapeA.v = new Vec2(0, 3*Math.random());
shapeA.I = 90000;
shapeA.m = 25;
// shapeA.angularVelocity = 0.1 * Math.random();
shapeA.staticFriction = 0.5;
shapeA.dynamicFriction = 0.1;

let versB = [
    new Vec2(40,0),
    new Vec2(80,5),
    new Vec2(140,70),
    new Vec2(0,75),
]
let shapeB = new Polygon(versB, new Vec2(200, 250), new Vec2(60, 35));
shapeB.v = new Vec2(0, -2 * Math.random());
shapeB.I = 90000;
shapeB.m = 30;
// shapeB.angularVelocity = 0.05 + 0.1 * Math.random();
shapeB.staticFriction = 0.5;
shapeB.dynamicFriction = 0.1;
// shapeB.setStatic();

let versC = [
    new Vec2(80,0),
    new Vec2(162,5),
    new Vec2(160,140),
    new Vec2(0,145),
]
let shapeC = new Polygon(versC, new Vec2(200, 250), new Vec2(80, 80));
shapeC.v = new Vec2(0, -5 + -2 * Math.random());
shapeC.I = 150000;
shapeC.m = 70;
// shapeC.angularVelocity = 0.05 + 0.1 * Math.random();
shapeC.staticFriction = 0.5;
shapeC.dynamicFriction = 0.1;

let versD = [
    new Vec2(90,0),
    new Vec2(165,20),
    new Vec2(150,150),
    new Vec2(0,130),
]
let shapeD = new Polygon(versD, new Vec2(200, 250), new Vec2(80, 84));
shapeD.v = new Vec2(0, -5 + -2 * Math.random());
shapeD.I = 150000;
shapeD.m = 120;
// shapeD.angularVelocity = 0.05 + 0.1 * Math.random();
shapeD.staticFriction = 0.5;
shapeD.dynamicFriction = 0.1;

let versE = [
    new Vec2(45,10),
    new Vec2(160,15),
    new Vec2(80,70),
    new Vec2(0,75),
]
let shapeE = new Polygon(versE, new Vec2(200, 250), new Vec2(90, 43));
shapeE.v = new Vec2(0, -5 + -2 * Math.random());
shapeE.I = 90000;
shapeE.m = 40;
// shapeE.angularVelocity = 0.05 + 0.1 * Math.random();
shapeE.staticFriction = 0.5;
shapeE.dynamicFriction = 0.1;


// let shapeC = new Circle(new Vec2(100, 150), 70);
// shapeC.m = 30;
// shapeC.strokeStyle = 'white';
// shapeC.angularVelocity = 0;
// shapeC.I = 7000;
// shapeC.v = new Vec2(5, -1);
// shapeC.staticFriction = 0.5;
// shapeC.dynamicFriction = 0.1;
//
// let shapeD = new Circle(new Vec2(70, 150), 70);
// shapeD.m = 30;
// shapeD.strokeStyle = 'white';
// shapeD.angularVelocity = 0;
// shapeD.I = 7000;
// shapeD.v = new Vec2(5, -1);
// shapeD.staticFriction = 0.5;
// shapeD.dynamicFriction = 0.1;
//
// let shapeE = new Circle(new Vec2(150, 150), 70);
// shapeE.m = 30;
// shapeE.strokeStyle = 'white';
// shapeE.angularVelocity = 0;
// shapeE.I = 7000;
// shapeE.v = new Vec2(5, -1);
// shapeE.staticFriction = 0.5;
// shapeE.dynamicFriction = 0.1;

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
wLeft.staticFriction = 0.5;
wLeft.dynamicFriction = 0.1;
wLeft.I = Infinity;
let wRight = new Polygon(wrapperA, new Vec2(500, 0), new Vec2(5, 250));
wRight.setStatic();
wRight.staticFriction = 0.5;
wRight.dynamicFriction = 0.1;
wRight.I = Infinity;
let wBtm = new Polygon(wrapperB, new Vec2(0, 500), new Vec2(250, 5));
wBtm.setStatic();
wBtm.staticFriction = 0.5;
wBtm.dynamicFriction = 0.1;
wBtm.I = Infinity;
let wTop = new Polygon(wrapperB, new Vec2(0, 0), new Vec2(250, 5));
wTop.setStatic();
wTop.staticFriction = 0.5;
wTop.dynamicFriction = 0.1;
wTop.I = Infinity;

// Hand of God !!!
const hog = new Engine(canvas, 3, false, true);
// hog.scale = 0.7;
hog.origin.x = 100;
hog.origin.y = 100;

// 添加实体
hog.add([shapeA, shapeB, shapeC, shapeD, shapeE, wLeft, wRight, wBtm, wTop]);
// hog.add([shapeA, shapeB, wLeft, wRight, wBtm, wTop]);

hog.addLaw(() => {
    // hog.among([shapeA, shapeB]).do((A, B) => hog.useElasticCollision(A, B));
    // hog.between([shapeA, shapeB], [wLeft, wRight, wBtm, wTop]).do((A, B) => hog.useElasticCollision(A, B));
    // [shapeA, shapeB].map(entity => entity.a.y = 0.1);
    [shapeA, shapeB, shapeC, shapeD, shapeE].map(entity => entity.a.y += 0.1);
    //
    hog.among([shapeA, shapeB, shapeC, shapeD, shapeE]).do((A, B) => hog.useElasticCollision(A, B));
    hog.between([shapeA, shapeB, shapeC, shapeD, shapeE], [wLeft, wRight, wBtm, wTop]).do((A, B) => hog.useElasticCollision(A, B));

    // [shapeA].map(entity => entity.a.y += 0.1);
    // hog.between([shapeA], [wLeft, wRight, wBtm, wTop]).do((A, B) => hog.useElasticCollision(A, B));

    // [shapeC].map(entity => hog.draftEase(entity));
})



// 开始运行
hog.run();

window.hog = hog;
