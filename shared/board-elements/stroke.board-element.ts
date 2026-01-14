import type { Point } from '../types/point.type.js';
import { distance } from '../utils/distance.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawStrokeBoardElement } from './raw/stroke.board-element.raw.js';

// TODO: put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;
 
export class StrokeBoardElement extends BaseBoardElement {
    private lastCoords: Point = { x: 0, y: 0 };
    private lastTime = 0;
    
    constructor (protected pos: Point, protected offsets: Point[] = []) { // store individual points as offsets
        super(pos);
        this.lastCoords = pos;
    }

    private checkTimeThreshold() {
        const now = Date.now();
        if (now - this.lastTime < timeThreshold) return false;
        return true;
    }

    private checkDistanceThreshold(worldCoords: Point) {
        if (distance(this.lastCoords, worldCoords) < distanceThreshold) return false;
        return true;
    }


    public addPoint(worldCoords: Point) {
        if (!this.checkTimeThreshold()) return;
        if (!this.checkDistanceThreshold(worldCoords)) return;

        this.offsets.push({x: worldCoords.x - this.pos.x, y: worldCoords.y - this.pos.y});
        this.lastCoords = {... worldCoords }
    }

    public setPosition(worldCoords: Point) {
        this.pos = worldCoords;
    }
    public getPosition() {
        return this.pos;
    }

    public override getPoints(): Point[] {
        return this.offsets.map(off => { return {x: off.x + this.pos.x, y: off.y + this.pos.y}}); // convert offsets to positions
    }

    public getOffsets(): Point[] { 
        return this.offsets;
    }

     
    public static fromRaw(raw: RawStrokeBoardElement) {
        return new StrokeBoardElement(raw.pos, raw.offsets);
    }
}