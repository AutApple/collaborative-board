import type { Point } from '../../types/point.type.js';
import type { RawBaseBoardElement } from './raw/base.board-element.raw.js';

export abstract class BaseBoardElement {
    protected _id: string;

    constructor (protected pos: Point, id?: string | undefined) { this._id = id ?? crypto.randomUUID(); }
    
    public get id() {
        return this._id;
    }

    public abstract clone(): BaseBoardElement;
    public abstract findClosestPointTo(worldCoords: Point): {point: Point, distance: number};

    protected static validatePoints(points: Point[]) {
        return points.length >= 1;
    }

    public abstract getPoints(): readonly Point[];
    public abstract setPoints(points: Point[]): void;

    public static fromRaw(raw: RawBaseBoardElement, id?: string | undefined) {
         throw new Error('Must be implemented in subclass');
    }
    public static fromPoints(points: Point[], id?: string | undefined) { 
        throw new Error('Must be implemented in subclass');
    }

    public abstract toRaw(): RawBaseBoardElement;
}