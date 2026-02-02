import { Vec2, type XY } from '../../utils/vec2.utils.js';
import type { RawBaseBoardElement } from './raw/base.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';
import { StrokeBoardElement } from './stroke.board-element.js';
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

    public static fromRaw(raw: RawBaseBoardElement, id?: string | undefined) {
        throw new Error('Must be implemented in subclass');
    }

    public abstract toRaw(): RawBaseBoardElement;
    public abstract optimizeVertices(): void;

    public abstract encode(): ArrayBuffer;

    public static fromEncoded(buffer: ArrayBuffer, id: string): BaseBoardElement {
        // check the type
        const view = new DataView(buffer);
        const type: BoardElementType = view.getUint8(0);
        switch (type) {
            case BoardElementType.Stroke:
                return this.strokeFromEncoded(buffer, id);
        }
    }
    private static strokeFromEncoded(buffer: ArrayBuffer, id: string): StrokeBoardElement {
        // 1 byte for element type (uint8), 
        // 1 byte for stroke size (uint8), 
        // 3 bytes for color data (uint8 * 3),
        // 4 bytes for X and 4 bytes for Y, 
        // 4 bytes for each offset x and 4 bytes for offset y
        let byteOffset = 1; // skip type byte cuz its irrelevant
        const view = new DataView(buffer);

        const size = view.getUint8(byteOffset++);
        const r = view.getUint8(byteOffset++);
        const g = view.getUint8(byteOffset++);
        const b = view.getUint8(byteOffset++);
        const color: string = '#' + r.toString(16).padStart(2, '0')
            + g.toString(16).padStart(2, '0')
            + b.toString(16).padStart(2, '0');
        const strokeData: StrokeData = {
            color, size
        };

        const posX = view.getInt32(byteOffset, true); byteOffset += 4;
        const posY = view.getInt32(byteOffset, true); byteOffset += 4;
        
        const offsets: Vec2[] = [];
        const offsetsByteSize = buffer.byteLength - byteOffset;
        if (offsetsByteSize % 8 !== 0) throw Error('Invalid data on decoding stroke'); 
        const offsetsLength = offsetsByteSize / 8;
        
        for (let i = 0; i < offsetsLength; i ++) {
            const x = view.getInt32(byteOffset, true); byteOffset += 4;
            const y = view.getInt32(byteOffset, true); byteOffset += 4;
            offsets.push(new Vec2(x, y));
        }

        const element = new StrokeBoardElement(new Vec2(posX, posY), strokeData, offsets, id);
        return element;
    }
}