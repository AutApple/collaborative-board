import type { Point } from '../../types/point.type.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawLineBoardElement } from './raw/line.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';

export class LineBoardElement extends BaseBoardElement {
    constructor(protected pos: Point, protected pos2: Point) {
        super(pos);
        this.pos2 = pos2;
    }

    public setPosition2(worldCoords: Point) {
        this.pos2 = { ...worldCoords };
    }

    public setPosition(worldCoords: Point) {
        this.pos = worldCoords;
    }
    public getPosition() {
        return this.pos;
    }

    public getPosition2(): Point {
        return this.pos2;
    }

    public override getPoints(): Point[] {
        return [this.pos, this.pos2];
    }

    public static override fromRaw(raw: RawLineBoardElement) {
        return new LineBoardElement(raw.pos, raw.pos2);
    }

    public override toRaw(): RawLineBoardElement {
        return {
            id: this.id,
            type: BoardElementType.Line,
            pos: this.pos,
            pos2: this.pos2
        };
    }
}