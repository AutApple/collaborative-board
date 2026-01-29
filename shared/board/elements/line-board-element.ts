import { Vec2 } from '../../types/vec2.type.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawLineBoardElement } from './raw/line.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

export class LineBoardElement extends BaseBoardElement {
    private vertices: Vec2[];
    protected pos2: Vec2 = new Vec2(0, 0);
    constructor(pos: Vec2, pos2: Vec2, protected strokeData: StrokeData, id?: string) {
        super(pos, strokeData, id);
        this.vertices = [];
        this.pos2.set(pos2);
        this.recalculateVertices();
    }

    public override clone(): LineBoardElement {
        return new LineBoardElement(this.pos, this.pos2, this.strokeData);
    }

    protected static override validateVertices(points: Vec2[]): boolean {
        return points.length <= 2;
    }

    private recalculateVertices(): void {
        // TODO: in-between vertices
        this.vertices = [new Vec2(this.pos.x, this.pos.y), new Vec2(this.pos2.x, this.pos2.y)];
        // console.log('Recalculated vertices ', this.vertices)
    }

    private recalculatePositions(): void {
        this.pos.set(this.vertices[0]!);
        this.pos2.set(this.vertices[this.vertices.length - 1]!);
    }

    public override findClosestPointTo(worldCoords: Vec2): Vec2 {
        const AB = this.pos2.sub(this.pos);
        const AP = worldCoords.sub(this.pos);

        let t = AB.dot(AP) / AB.dot(AB);
        t = Math.max(0, Math.min(1, t));

        return this.pos.add(AB.mulScalar(t));
    }

    public setPosition2(worldCoords: Vec2) {
        this.pos2.set(worldCoords);
        this.recalculateVertices();
    }

    public setPosition(worldCoords: Vec2) {
        this.pos.set(worldCoords);
        this.recalculateVertices();
    }
    public getPosition() {
        return this.pos;
    }

    public getPosition2(): Vec2 {
        return this.pos2;
    }

    public override getVertices(): readonly Vec2[] {
        return this.vertices;
    }
    public override setVertices(vertices: Vec2[]) {
        if (!LineBoardElement.validateVertices(vertices))
            throw Error('Wrong points array signature'); // TODO: replace with centralized messages
        this.vertices = vertices;
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
    public override optimizeVertices(): void { // no need for point optimization for the line
        return;
    }
}