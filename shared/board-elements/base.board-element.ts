import { Vec2 } from '../utils/vec2.utils.js';
import type { RawBaseBoardElement } from './raw/base.board-element.raw.js';
import type { StrokeData } from './types/stroke-data.type.js';




export abstract class BaseBoardElement {
    protected _id: string;
    protected pos: Vec2 = new Vec2(0, 0);
    protected strokeData: StrokeData;
    constructor(pos: Vec2, strokeData: StrokeData, id?: string | undefined) {
        this._id = id ?? crypto.randomUUID();
        this.strokeData = { ...strokeData };
        this.pos.set(pos);
    }
    public get position() {
        return this.pos;
    }
    public get id() {
        return this._id;
    }
    public getStrokeData() {
        return this.strokeData;
    }

    public abstract clone(): BaseBoardElement;
    public abstract findClosestPointTo(worldCoords: Vec2): Vec2;

    protected static validateVertices(points: Vec2[]) {
        return points.length >= 1;
    }

    public abstract getVertices(): readonly Vec2[];
    public abstract setVertices(vertices: Vec2[]): void;



    public abstract toRaw(): RawBaseBoardElement;
    public abstract optimizeVertices(): void;

    public abstract encode(): ArrayBuffer;

}