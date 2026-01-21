import { Vec2 } from '../../types/vec2.type.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawStrokeBoardElement } from './raw/stroke.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

// TODO: put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;

export class StrokeBoardElement extends BaseBoardElement {
    private lastCoords: Vec2 = new Vec2(0, 0);
    private lastTime = 0;

    constructor(pos: Vec2, protected strokeData: StrokeData, protected offsets: Vec2[] = [], id?: string | undefined) { // store individual points as offsets
        super(pos, strokeData, id);
        this.lastCoords = pos;
    }

    public override clone(): StrokeBoardElement {
        return new StrokeBoardElement(this.pos, this.strokeData, this.offsets);
    }

    private checkTimeThreshold() {
        const now = Date.now();
        if (now - this.lastTime < timeThreshold) return false;
        return true;
    }

    private checkDistanceThreshold(worldCoords: Vec2) {
        if (this.lastCoords.distanceTo(worldCoords) < distanceThreshold) return false;
        return true;
    }


    public override findClosestPointTo(worldCoords: Vec2): { point: Vec2, distance: number; } {
        const points = this.getPoints();

        let point = this.pos;
        let minDistance = Infinity;

        for (const p of points) {
            const dist = p.distanceTo(worldCoords);
            if (dist < minDistance) {
                minDistance = dist;
                point = p;
            }
        }
        return { point, distance: minDistance };
    }

    private static pointToOffset(point: Vec2, pos: Vec2): Vec2 {
        return point.sub(pos);
    }

    protected static override validatePoints(points: Vec2[]) {
        return !(points.length < 1 && !points.every(p => p !== undefined));
    }
    public addPoint(worldCoords: Vec2) {
        if (!this.checkTimeThreshold()) return;
        if (!this.checkDistanceThreshold(worldCoords)) return;

        this.offsets.push(StrokeBoardElement.pointToOffset(worldCoords, this.pos));
        this.lastCoords.set(worldCoords);
    }

    public setPosition(worldCoords: Vec2) {
        this.pos = worldCoords;
    }
    public getPosition() {
        return this.pos;
    }

    public getOffsets(): Vec2[] {
        return this.offsets;
    }

    public override getPoints(): readonly Vec2[] {
        return this.offsets.map(off => { return off.add(this.pos) }); // convert offsets to positions
    }

    public override setPoints(points: Vec2[]) {
        if (!StrokeBoardElement.validatePoints(points))
            throw Error('Wrong points array signature'); // TODO: replace with centralized messages
        this.pos.set(points[0]!);
        this.offsets = points.map(p => {
            return StrokeBoardElement.pointToOffset(p, this.pos);
        });
    }

    public static override fromRaw(raw: RawStrokeBoardElement, id?: string) {
        return new StrokeBoardElement(Vec2.fromXY(raw.pos), raw.strokeData, raw.offsets.map(off => Vec2.fromXY(off)), id);
    }


    public override toRaw(): RawStrokeBoardElement {
        return {
            id: this._id,
            type: BoardElementType.Stroke,
            pos: this.pos,
            lastCoords: this.lastCoords,
            lastTime: this.lastTime,
            offsets: this.offsets,

            strokeData: this.strokeData
        };
    }
}