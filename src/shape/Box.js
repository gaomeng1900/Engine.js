import {Base} from './Base';

export class Box extends Base {
    constructor(x1, x2, y1, y2, restitution) {
        super(0, 0);
        this.zone = [x1, x2, y1, y2];
        this.restitution = restitution;
    }

    getBounds() {
        return {
            type: 'box',
            zone: this.zone,
            restitution: this.restitution,
        }
    }
}
