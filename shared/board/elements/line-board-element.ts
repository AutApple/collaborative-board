import type { Point } from '../../types/point.type.js';
import { distance } from '../../utils/distance.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawLineBoardElement } from './raw/line.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';

export class LineBoardElement extends BaseBoardElement {
    constructor(protected pos: Point, protected pos2: Point, id?: string | undefined) {
        super(pos, id);
        this.pos2 = pos2;
    }

    public override clone(): LineBoardElement {
        return new LineBoardElement(this.pos, this.pos2);
    }

    protected static override validatePoints(points: Point[]): boolean {
        return !(points.length !== 2 || !points[0] || !points[1])
    } 

    
    public override findClosestPointTo(worldCoords: Point): {point: Point, distance: number} {
        const distA = distance(this.pos, worldCoords);
        const distB = distance(this.pos2, worldCoords);
        return distA < distB ? {point: this.pos, distance: distA}: {point: this.pos2, distance: distB};
    }

    public static override fromPoints(points: Point[], id?: string | undefined): LineBoardElement {
        if(!LineBoardElement.validatePoints(points)) throw Error('Can\'t create line element from the specified points array');
        return new LineBoardElement(points[0]!, points[1]!, id);
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

    public override getPoints(): readonly Point[] {
        return [this.pos, this.pos2];
    }
    public override setPoints(points: Point[]) {
        if (!LineBoardElement.validatePoints(points))
                throw Error('Wrong points array signature'); // TODO: replace with centralized messages
        this.pos = points[0]!;
        this.pos2 = points[1]!;
    }

    public static override fromRaw(raw: RawLineBoardElement, id?: string | undefined) {
        return new LineBoardElement(raw.pos, raw.pos2, id);
    }

    public override toRaw(): RawLineBoardElement {
        return {
            id: this._id,
            type: BoardElementType.Line,
            pos: this.pos,
            pos2: this.pos2
        };
    }
}