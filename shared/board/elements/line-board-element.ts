import type { Point } from '../../types/point.type.js';
import { distance } from '../../utils/distance.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawLineBoardElement } from './raw/line.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

export class LineBoardElement extends BaseBoardElement {
    private points: Point[];
    constructor(protected pos: Point, protected pos2: Point, protected strokeData: StrokeData, id?: string) {
        super(pos, strokeData, id);
        this.points = [];
        this.recalculatePoints();
    }

    public override clone(): LineBoardElement {
        return new LineBoardElement(this.pos, this.pos2, this.strokeData);
    }

    protected static override validatePoints(points: Point[]): boolean {
        return points.length <= 2;
    }

    private recalculatePoints(): void {
        // TODO: in-between points
        this.points = [this.pos, this.pos2];
        // console.log('Recalculated points ', this.points)
    }

    private recalculatePositions(): void {
        this.pos = this.points[0]!;
        this.pos2 = this.points[this.points.length - 1]!;
    }

    public override findClosestPointTo(worldCoords: Point): { point: Point, distance: number; } {
        const distA = distance(this.pos, worldCoords);
        const distB = distance(this.pos2, worldCoords);
        return distA < distB ? { point: this.pos, distance: distA } : { point: this.pos2, distance: distB };
    }

    public setPosition2(worldCoords: Point) {
        this.pos2 = { ...worldCoords };
        this.recalculatePoints();
    }

    public setPosition(worldCoords: Point) {
        this.pos = { ...worldCoords };
        this.recalculatePoints();
    }
    public getPosition() {
        return this.pos;
    }

    public getPosition2(): Point {
        return this.pos2;
    }

    public override getPoints(): readonly Point[] {
        return this.points;
    }
    public override setPoints(points: Point[]) {
        if (!LineBoardElement.validatePoints(points))
            throw Error('Wrong points array signature'); // TODO: replace with centralized messages
        this.points = points;
        this.recalculatePositions();
    }

    public static override fromRaw(raw: RawLineBoardElement, id?: string | undefined) {
        return new LineBoardElement(raw.pos, raw.pos2, raw.strokeData, id);
    }

    public override toRaw(): RawLineBoardElement {
        return {
            id: this._id,
            type: BoardElementType.Line,
            pos: this.pos,
            pos2: this.pos2,
            
            strokeData: this.strokeData,
        };
    }
}