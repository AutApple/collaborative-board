import { Vec2 } from '../../types/vec2.type.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawLineBoardElement } from './raw/line.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

export class LineBoardElement extends BaseBoardElement {
    private points: Vec2[];
    protected pos2: Vec2 = new Vec2(0, 0);
    constructor(pos: Vec2, pos2: Vec2, protected strokeData: StrokeData, id?: string) {
        super(pos, strokeData, id);
        this.points = [];
        this.pos2.set(pos2);
        this.recalculatePoints();
    }

    public override clone(): LineBoardElement {
        return new LineBoardElement(this.pos, this.pos2, this.strokeData);
    }

    protected static override validatePoints(points: Vec2[]): boolean {
        return points.length <= 2;
    }

    private recalculatePoints(): void {
        // TODO: in-between points
        this.points = [new Vec2(this.pos.x, this.pos.y), new Vec2(this.pos2.x, this.pos2.y)];
        // console.log('Recalculated points ', this.points)
    }

    private recalculatePositions(): void {
        this.pos.set(this.points[0]!);
        this.pos2.set(this.points[this.points.length - 1]!);
    }

    public override findClosestPointTo(worldCoords: Vec2): { point: Vec2, distance: number; } {
        const distA = this.pos.distanceTo(worldCoords);
        const distB = this.pos2.distanceTo(worldCoords);
        return distA < distB ? { point: this.pos, distance: distA } : { point: this.pos2, distance: distB };
    }

    public setPosition2(worldCoords: Vec2) {
        this.pos2.set(worldCoords);
        this.recalculatePoints();
    }

    public setPosition(worldCoords: Vec2) {
        this.pos.set(worldCoords);
        this.recalculatePoints();
    }
    public getPosition() {
        return this.pos;
    }

    public getPosition2(): Vec2 {
        return this.pos2;
    }

    public override getPoints(): readonly Vec2[] {
        return this.points;
    }
    public override setPoints(points: Vec2[]) {
        if (!LineBoardElement.validatePoints(points))
            throw Error('Wrong points array signature'); // TODO: replace with centralized messages
        this.points = points;
        this.recalculatePositions();
    }

    public static override fromRaw(raw: RawLineBoardElement, id?: string | undefined) {
        return new LineBoardElement(Vec2.fromXY(raw.pos), Vec2.fromXY(raw.pos2), raw.strokeData, id);
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