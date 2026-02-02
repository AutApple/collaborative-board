import { sharedConfiguration } from '../../config/shared.config.js';
import { Vec2 } from '../../utils/vec2.utils.js';
import { BaseBoardElement } from './base.board-element.js';
import type { RawStrokeBoardElement } from './raw/stroke.board-element.raw.js';
import { BoardElementType } from './raw/types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

export class StrokeBoardElement extends BaseBoardElement {
    constructor(pos: Vec2, strokeData: StrokeData, protected offsets: Vec2[] = [], id?: string | undefined) { // store individual points as offsets
        super(pos, strokeData, id);
    }

    public override clone(): StrokeBoardElement {
        return new StrokeBoardElement(this.pos, this.strokeData, this.offsets);
    }


    public override findClosestPointTo(worldCoords: Vec2): Vec2 {
        const vertices = this.getVertices();

        let closestPoint = this.pos;
        let minDistance = Infinity;

        for (let i = 0; i < vertices.length - 1; i++) {
            const A = vertices[i]!;
            const B = vertices[i + 1]!;

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

    protected static override validateVertices(points: Vec2[]) {
        return !(points.length < 1 && !points.every(p => p !== undefined));
    }
    public addVertex(worldCoords: Vec2) {
        this.offsets.push(StrokeBoardElement.pointToOffset(worldCoords, this.pos));
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

    public override getVertices(): readonly Vec2[] {
        return this.offsets.map(off => { return off.add(this.pos); }); // convert offsets to positions
    }

    public override setVertices(points: Vec2[]) {
        if (!StrokeBoardElement.validateVertices(points))
            throw Error('Wrong points array signature'); // TODO: replace with centralized messages
        // this.setPosition(points[0]!);
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
            offsets: this.offsets,
            strokeData: this.strokeData
        };
    }

    private hexToRgbBytes(hex: string): [number, number, number] {
        if (!/^#?[0-9a-fA-F]{6}$/.test(hex)) {
            throw new Error("Invalid hex color");
        }

        if (hex.startsWith("#")) {
            hex = hex.slice(1);
        }

        return [
            parseInt(hex.slice(0, 2), 16), // R
            parseInt(hex.slice(2, 4), 16), // G
            parseInt(hex.slice(4, 6), 16), // B
        ];
    }

    public override encode(): ArrayBuffer {
        // 1 byte for element type (uint8), 
        // 1 byte for stroke size (uint8), 
        // 3 bytes for color data (uint8 * 3),
        // 4  bytes for X and 4 bytes for Y, 
        // 4 bytes for each offset x and 4 bytes for offset y
        const buffer = new ArrayBuffer(1 + 1 + 3 + 8 + this.offsets.length * 8);
        const view = new DataView(buffer);


        let byteOffset = 0;

        view.setUint8(byteOffset++, BoardElementType.Stroke);
        view.setUint8(byteOffset++, this.strokeData.size);

        const [r, g, b] = this.hexToRgbBytes(this.strokeData.color);

        view.setUint8(byteOffset++, r);
        view.setUint8(byteOffset++, g);
        view.setUint8(byteOffset++, b);


        view.setInt32(byteOffset, this.pos.x, true); byteOffset += 4;
        view.setInt32(byteOffset, this.pos.y, true); byteOffset += 4;

        for (const offset of this.offsets) {
            view.setInt32(byteOffset, offset.x, true); byteOffset += 4;
            view.setInt32(byteOffset, offset.y, true); byteOffset += 4;
        }

        return buffer;
    }


    public override optimizeVertices(): void { // use RDP algorhythm for stroke optimization. 
        function rdp(vertices: readonly Vec2[]): Vec2[] {
            let maxDist = 0;
            let index = 0;
            const endIndex = vertices.length - 1;

            const first = vertices[0]!;
            const last = vertices[endIndex]!;

            for (let i = 1; i < endIndex; i++) {
                const dist = vertices[i]!.perpendicularDistanceTo(first, last);
                if (dist > maxDist) {
                    maxDist = dist;
                    index = i;
                }
            }

            if (maxDist > epsilon) {
                const left = rdp(vertices.slice(0, index + 1));
                const right = rdp(vertices.slice(index));

                return [...left.slice(0, -1), ...right];
            } else
                return [first, last];
        }
        const epsilon = sharedConfiguration.rdpOptimizationEpsilon;
        const verticesList = this.getVertices();
        if (verticesList.length <= 2) return;
        // console.log(`Optimizaiton (e=${epsilon}) start. Initial points: ${pointsList.map(p => `{x: ${p.x},y: ${p.y}}, `)}`)

        this.setVertices(rdp(verticesList));
        // console.log(`Optimizaiton (e=${epsilon}) end. Resulting points: ${this.getPoints().map(p => `{x: ${p.x},y: ${p.y}}, `)}`)
        return;
    }
}