import type { Point } from '../../types/point.type.js';
import type { RawBaseBoardElement } from './raw/base.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';

export class BaseBoardElement {
    protected id: string;

    constructor (protected pos: Point, id?: string | undefined) { this.id = id ?? crypto.randomUUID(); }
    
    public get getId() {
        return this.id;
    }

    protected static validatePoints(points: Point[]) {
        return points.length >= 1;
    }

    public getPoints(): Point[] { return []; }
    public setPoints(points: Point[]) {
        if (!BaseBoardElement.validatePoints(points))
                console.log('Can\'t validate points');
    }

    public static fromRaw(raw: RawBaseBoardElement, id?: string | undefined) { return new BaseBoardElement(raw.pos, id); }
    public static fromPoints(points: Point[], id?: string | undefined) { 
        if (!BaseBoardElement.validatePoints(points)) 
            throw Error('Can\'t create board element from empty points array')
        return new BaseBoardElement(points[0]!, id);
    }

    public toRaw(): RawBaseBoardElement {
        return {id: this.id, type: BoardElementType.Null, pos: this.pos}
    }
}