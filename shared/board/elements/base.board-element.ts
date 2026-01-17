import type { Point } from '../../types/point.type.js';
import type { RawBaseBoardElement } from './raw/base.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';

export class BaseBoardElement {
    private id: string;
    constructor (protected pos: Point) { this.id = crypto.randomUUID(); }
    
    public get getId() {
        return this.id;
    }

    public getPoints(): Point[] { return []; }
    public static fromRaw(raw: RawBaseBoardElement) { return new BaseBoardElement(raw.pos); }
    public toRaw(): RawBaseBoardElement {
        return {type: BoardElementType.Null, pos: this.pos}
    }
}