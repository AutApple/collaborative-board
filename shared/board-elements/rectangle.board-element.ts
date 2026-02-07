import { Vec2, type XY } from '../utils/vec2.utils.js';
import {
	BaseCornerDefinedBoardElement,
	type BaseUpdateCornerDefinedElementData,
	type RawBaseCornerDefinedBoardElement,
} from './base/base-corner-defined.board-element.js';
import { BoardElementType } from './types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

export interface UpdateRectangleElementData extends BaseUpdateCornerDefinedElementData {
	type: BoardElementType.Rectangle;
}

export interface RawRectangleBoardElement extends RawBaseCornerDefinedBoardElement {
	type: BoardElementType.Rectangle;
}

export class RectangleBoardElement extends BaseCornerDefinedBoardElement {
	public type: BoardElementType = BoardElementType.Rectangle;
	constructor(pos: Vec2, strokeData: StrokeData, secondPoint: Vec2, id?: string | undefined) {
		super(pos, secondPoint, strokeData, id);
	}

	private computeClosestPointData(worldCoords: Vec2): {
		closestPoint: Vec2;
		distance: number;
	} {
		const rect = this.getRectPoints();

		const minX = rect.topLeft.x;
		const maxX = rect.bottomRight.x;
		const minY = rect.topLeft.y;
		const maxY = rect.bottomRight.y;

		// compute the closest point on each edge
		const topEdge = { x: Math.max(minX, Math.min(worldCoords.x, maxX)), y: maxY };
		const bottomEdge = { x: Math.max(minX, Math.min(worldCoords.x, maxX)), y: minY };
		const leftEdge = { x: minX, y: Math.max(minY, Math.min(worldCoords.y, maxY)) };
		const rightEdge = { x: maxX, y: Math.max(minY, Math.min(worldCoords.y, maxY)) };

		// compare edge distances
		const edges = [topEdge, bottomEdge, leftEdge, rightEdge];
		let minDist = Infinity;
		let closest: XY = edges[0]!;

		for (const pt of edges) {
			const d = worldCoords.distanceTo(pt);
			if (d < minDist) {
				minDist = d;
				closest = pt;
			}
		}

		return {
			closestPoint: Vec2.fromXY(closest),
			distance: minDist,
		};
	}

	public onAdd(): void {
		return;
	}
	public onUpdate(): void {
		return;
	}
	public onRemove(): void {
		return;
	}
	public clone(): RectangleBoardElement {
		return new RectangleBoardElement(this.pos, this.strokeData, this.secondPoint);
	}

	public updateData(payload: UpdateRectangleElementData): void {
		if (payload.type !== BoardElementType.Rectangle)
			throw new Error(
				"Error on updating element: element type doesn't match the type stated in a payload",
			);
		if (payload.secondPoint) this.secondPoint = payload.secondPoint;
	}

	public toUpdateData(): UpdateRectangleElementData {
		return {
			type: BoardElementType.Rectangle,
			secondPoint: this.secondPoint,
		};
	}

	public distanceTo(worldCoords: Vec2): number {
		return this.computeClosestPointData(worldCoords).distance;
	}

	public findClosestPointTo(worldCoords: Vec2): Vec2 {
		return this.computeClosestPointData(worldCoords).closestPoint;
	}

	public toRaw(): RawRectangleBoardElement {
		return {
			id: this.id,
			type: BoardElementType.Rectangle,
			pos: this.pos,
			secondPoint: this.secondPoint,
			strokeData: this.strokeData,
		};
	}

	public static fromRaw(raw: RawRectangleBoardElement) {
		return new RectangleBoardElement(Vec2.fromXY(raw.pos), raw.strokeData, Vec2.fromXY(raw.secondPoint), raw.id);
	}
	
	public static fromEncoded(buffer: ArrayBuffer, id: string): RectangleBoardElement {
		// 1 byte for element type (uint8),
		// 1 byte for stroke size (uint8),
		// 3 bytes for color data (uint8 * 3),
		// 4 bytes for X and 4 bytes for Y,
		// 4 bytes for  second X  and 4 bytes for second Y
		let byteOffset = 1; // not interested in type byte 
		const view = new DataView(buffer);

		const size = view.getUint8(byteOffset++);
		const r = view.getUint8(byteOffset++);
		const g = view.getUint8(byteOffset++);
		const b = view.getUint8(byteOffset++);
		const color: string = this.rgbBytesToHex(r, g, b);
		const strokeData: StrokeData = {
			color,
			size,
		};

		const posX = view.getInt32(byteOffset, true);
		byteOffset += 4;
		const posY = view.getInt32(byteOffset, true);
		byteOffset += 4;

		const secondPosX = view.getInt32(byteOffset, true);
		byteOffset += 4;
		const secondPosY = view.getInt32(byteOffset, true);
		byteOffset += 4;
		 

		const element = new RectangleBoardElement(new Vec2(posX, posY), strokeData, new Vec2(secondPosX, secondPosY), id);
		return element;
	}
}

