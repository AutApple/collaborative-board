import type { Point } from '../types/point.type.js';

export class BaseBoardElement {
    constructor (protected pos: Point) {}
    public getPoints(): Point[] { return []; }
}