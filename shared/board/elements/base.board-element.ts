import { Vec2 } from '../../types/vec2.type.js';
import type { RawBaseBoardElement } from './raw/base.board-element.raw.js';
import type { StrokeData } from './types/stroke-data.type.js';

export abstract class BaseBoardElement {
    protected _id: string;
    protected pos: Vec2 = new Vec2(0, 0);
    constructor(pos: Vec2, protected strokeData: StrokeData, id?: string | undefined) { 
        this._id = id ?? crypto.randomUUID(); 
        this.pos.set(pos);
    }

    public get id() {
        return this._id;
    }
    public getStrokeData() {
        return this.strokeData;
    }

    public abstract clone(): BaseBoardElement;
    public abstract findClosestPointTo(worldCoords: Vec2): { point: Vec2, distance: number; };

    protected static validatePoints(points: Vec2[]) {
        return points.length >= 1;
    }

    public abstract getPoints(): readonly Vec2[];
    public abstract setPoints(points: Vec2[]): void;

    public static fromRaw(raw: RawBaseBoardElement, id?: string | undefined) {
        throw new Error('Must be implemented in subclass');
    }

    public abstract toRaw(): RawBaseBoardElement;
    public abstract optimizePoints(): void;
}