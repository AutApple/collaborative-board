import type { Point } from '../../types/point.type.js';
import { distance } from '../../utils/distance.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawStrokeBoardElement } from './raw/stroke.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';

// TODO: put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;
 
export class StrokeBoardElement extends BaseBoardElement {
    private lastCoords: Point = { x: 0, y: 0 };
    private lastTime = 0;
    
    constructor (protected pos: Point, protected offsets: Point[] = [], id?: string | undefined) { // store individual points as offsets
        super(pos, id);
        this.lastCoords = pos;
    }
    
    public override clone(): StrokeBoardElement {
        return new StrokeBoardElement(this.pos, this.offsets);
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

    
    public override findClosestPointTo(worldCoords: Point): {point: Point, distance: number} {
        const points = this.getPoints();
        
        let point = this.pos;
        let minDistance = Infinity;

        for (const p of points) {
            const dist = distance(p, worldCoords); 
            if (dist < minDistance) {
                minDistance = dist;
                point = p;
            }
        }
        return {point, distance: minDistance};
    }


    private static pointToOffset(point: Point, pos: Point): Point {
        return {x: point.x - pos.x, y: point.y - pos.y}
    }
    protected static override validatePoints(points: Point[]) {
        return !(points.length < 1 && !points.every(p => p !== undefined));
    }
    public addPoint(worldCoords: Point) {
        if (!this.checkTimeThreshold()) return;
        if (!this.checkDistanceThreshold(worldCoords)) return;

        this.offsets.push(StrokeBoardElement.pointToOffset(worldCoords, this.pos));
        this.lastCoords = {... worldCoords }
    }

    public setPosition(worldCoords: Point) {
        this.pos = worldCoords;
    }
    public getPosition() {
        return this.pos;
    }

    public getOffsets(): Point[] { 
        return this.offsets;
    }
    
    public override getPoints(): readonly Point[] {
        return this.offsets.map(off => { return {x: off.x + this.pos.x, y: off.y + this.pos.y}}); // convert offsets to positions
    }
    
    public override setPoints(points: Point[]) {
        if (!StrokeBoardElement.validatePoints(points))
                throw Error('Wrong points array signature'); // TODO: replace with centralized messages
        this.pos = points[0]!;
        this.offsets = points.map(p => {
            return StrokeBoardElement.pointToOffset(p, this.pos);
        });
    }

    public static override  fromPoints(points: Point[], id?: string | undefined): StrokeBoardElement {
        if (!StrokeBoardElement.validatePoints(points))
            throw Error('Can\'t create stroke element from the specified points array');
        const pos = points[0]!;
        const offsets = points.map(p => {
            return StrokeBoardElement.pointToOffset(p, pos);
        });
        return new StrokeBoardElement(pos, offsets, id);
    }

    public static override fromRaw(raw: RawStrokeBoardElement, id?: string | undefined) {
        return new StrokeBoardElement(raw.pos, raw.offsets, id);
    }

    
    public override toRaw(): RawStrokeBoardElement {
            return {
                id: this._id,
                type: BoardElementType.Stroke, 
                pos: this.pos, 
                lastCoords: this.lastCoords, 
                lastTime: this.lastTime, 
                offsets: this.offsets
            };
    }
}