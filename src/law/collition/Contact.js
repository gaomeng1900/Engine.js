import { getDistance, Vec2, vecTripleProduct, support } from '../../common/math';

class Contact {
    constructor(shapeA, shapeB, edge, d) {
        this.shapeA = shapeA;
        this.shapeB = shapeB;
        this.edge = edge;
        this.parseEdge(edge);
        this.setDepth(d);
    }

    parseEdge(edge) {
        // 提取最近边上的支撑点的来源顶点
        let aA = edge.a.info.pair.A;
        let bA = edge.b.info.pair.A;
        let aB = edge.a.info.pair.B;
        let bB = edge.b.info.pair.B;
        if (aA.equal(bA)) {
            // A上为碰撞点
            this.featureA = {
                type: 'point',
                point: aA,
            }
        }
        else {
            // A上为碰撞边
            this.featureA = {
                type: 'edge',
                a: aA,
                b: bA,
            }
        }
        if (aB.equal(bB)) {
            // B上为碰撞点
            this.featureB = {
                type: 'point',
                point: aB,
            }
        }
        else {
            // B上为碰撞边
            this.featureB = {
                type: 'edge',
                a: aB,
                b: bB,
            }
        }

        this.normal = edge.normal;
    }

    setDepth(d) {
        this.depth = d;
    }

    draw(ct) {
        // // 画出明克夫斯基差上离原点的最近边
        // ct.save();
        // ct.beginPath();
        // ct.moveTo(this.edge.a.x, this.edge.a.y);
        // ct.lineWidth = 4;
        // ct.strokeStyle = 'white';
        // ct.lineTo(this.edge.b.x, this.edge.b.y);
        // ct.stroke();
        // ct.restore();

        ct.save();
        // 画出A上的接触边/点
        ct.beginPath();
        if (this.featureA.type === 'point') {
            ct.fillStyle = 'green';
            ct.fillRect(this.featureA.point.x, this.featureA.point.y, 10, 10);
        } else {
            ct.moveTo(this.featureA.a.x, this.featureA.a.y);
            ct.lineWidth = 4;
            ct.strokeStyle = 'yellow';
            ct.lineTo(this.featureA.b.x, this.featureA.b.y);
            ct.stroke();
        }
        // 画出A上的接触边/点
        ct.beginPath();
        if (this.featureB.type === 'point') {
            ct.fillStyle = 'green';
            ct.fillRect(this.featureB.point.x, this.featureB.point.y, 10, 10);
        } else {
            ct.moveTo(this.featureB.a.x, this.featureB.a.y);
            ct.lineWidth = 4;
            ct.strokeStyle = 'yellow';
            ct.lineTo(this.featureB.b.x, this.featureB.b.y);
            ct.stroke();
        }
        ct.restore();

        // // 画出碰撞矢量(最短分离矢量)
        // ct.save();
        // ct.translate(this.shapeA.vertexes[0].x, this.shapeA.vertexes[0].y);
        // ct.beginPath();
        // ct.moveTo(0,0);
        // ct.lineWidth = 2;
        // ct.strokeStyle = 'white';
        // let n = this.normal.mult(this.depth);
        // ct.lineTo(n.x, n.y);
        // ct.stroke();
        // ct.restore();
    }
}

export default Contact;
