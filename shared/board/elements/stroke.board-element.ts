import { Vec2 } from '../../types/vec2.type.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawStrokeBoardElement } from './raw/stroke.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

// TODO: put these constants in some config 
const timeThreshold = 16;
const distanceThreshold = 3;

export class StrokeBoardElement extends BaseBoardElement {
    private lastCoords: Vec2 = new Vec2(0, 0);
    private lastTime = 0;

    constructor(pos: Vec2, protected strokeData: StrokeData, protected offsets: Vec2[] = [], id?: string | undefined) { // store individual points as offsets
        super(pos, strokeData, id);
        this.lastCoords = pos;
    }

    public override clone(): StrokeBoardElement {
        return new StrokeBoardElement(this.pos, this.strokeData, this.offsets);
    }

    private checkTimeThreshold() {
        const now = Date.now();
        if (now - this.lastTime < timeThreshold) return false;
        return true;
    }

    private checkDistanceThreshold(worldCoords: Vec2) {
        if (this.lastCoords.distanceTo(worldCoords) < distanceThreshold) return false;
        return true;
    }

    public override findClosestPointTo(worldCoords: Vec2): Vec2 {
        const points = this.getPoints();

        let closestPoint = this.pos;
        let minDistance = Infinity;

        for (let i = 0; i < points.length - 1; i++) {
            const A = points[i]!;
            const B = points[i + 1]!;

            const AB = B.sub(A);
            const AP = worldCoords.sub(A);

            let t = AB.dot(AP) / AB.dot(AB);
            t = Math.max(0, Math.min(1, t));

            const projection = A.add(AB.mulScalar(t));

            const dist = projection.distanceTo(worldCoords);
            if (dist < minDistance) {
                minDistance = dist;
                closestPoint = projection;
            }
        }

        return closestPoint;
    }
     

    private static pointToOffset(point: Vec2, pos: Vec2): Vec2 {
        return point.sub(pos);
    }

    protected static override validatePoints(points: Vec2[]) {
        return !(points.length < 1 && !points.every(p => p !== undefined));
    }
    public addPoint(worldCoords: Vec2) {
        if (!this.checkTimeThreshold()) return;
        if (!this.checkDistanceThreshold(worldCoords)) return;

        this.offsets.push(StrokeBoardElement.pointToOffset(worldCoords, this.pos));
        this.lastCoords.set(worldCoords);
    }

    public setPosition(worldCoords: Vec2) {
        this.pos = Vec2.fromXY(worldCoords);
    }
    public getPosition() {
        return this.pos;
    }

    public getOffsets(): Vec2[] {
        return this.offsets;
    }

    public override getPoints(): readonly Vec2[] {
        return this.offsets.map(off => { return off.add(this.pos); }); // convert offsets to positions
    }

    public override setPoints(points: Vec2[]) {
        if (!StrokeBoardElement.validatePoints(points))
            throw Error('Wrong points array signature'); // TODO: replace with centralized messages
        this.setPosition(points[0]!);
        this.offsets = points.map(p => {
            return StrokeBoardElement.pointToOffset(p, this.pos);
        });
    }

    public static override fromRaw(raw: RawStrokeBoardElement, id?: string) {
        return new StrokeBoardElement(Vec2.fromXY(raw.pos), raw.strokeData, raw.offsets.map(off => Vec2.fromXY(off)), id);
    }

    public override toRaw(): RawStrokeBoardElement {
        return {
            id: this._id,
            type: BoardElementType.Stroke,
            pos: this.pos,
            lastCoords: this.lastCoords,
            lastTime: this.lastTime,
            offsets: this.offsets,

            strokeData: this.strokeData
        };
    }

    public override optimizePoints(): void { // use RDP algorhythm for stroke optimization. 
        function rdp(points: readonly Vec2[]): Vec2[] {
            let maxDist = 0;
            let index = 0;
            const endIndex = points.length - 1;

            const first = points[0]!;
            const last = points[endIndex]!;

            for (let i = 1; i < endIndex; i++) {
                const dist = points[i]!.perpendicularDistanceTo(first, last);
                if (dist > maxDist) {
                    maxDist = dist;
                    index = i;
                }
            }

            if (maxDist > epsilon) {
                const left = rdp(points.slice(0, index + 1));
                const right = rdp(points.slice(index));

                return [...left.slice(0, -1), ...right];
            } else
                return [first, last];
        }
        const epsilon = 3; // TODO: retrieve epsilon from  the configuration. hardcoded value is temporary solution before i make proper config system
        const pointsList = this.getPoints();
        if (pointsList.length <= 2) return;
        // console.log(`Optimizaiton (e=${epsilon}) start. Initial points: ${pointsList.map(p => `{x: ${p.x},y: ${p.y}}, `)}`)

        this.setPoints(rdp(pointsList));
        // console.log(`Optimizaiton (e=${epsilon}) end. Resulting points: ${this.getPoints().map(p => `{x: ${p.x},y: ${p.y}}, `)}`)
        return;
    }
}