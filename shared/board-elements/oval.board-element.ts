import { Vec2, type XY } from '../utils/vec2.utils.js';
import {
	BaseCornerDefinedBoardElement,
	type BaseUpdateCornerDefinedElementData,
	type RawBaseCornerDefinedBoardElement,
} from './base/base-corner-defined.board-element.js';
import { BoardElementType } from './types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

export interface UpdateOvalElementData extends BaseUpdateCornerDefinedElementData {
	type: BoardElementType.Oval;
}

export interface RawOvalBoardElement extends RawBaseCornerDefinedBoardElement {
	type: BoardElementType.Oval;
}

export class OvalBoardElement extends BaseCornerDefinedBoardElement {
	public type: BoardElementType = BoardElementType.Oval;
	constructor(pos: Vec2, strokeData: StrokeData, secondPoint: Vec2, id?: string | undefined) {
		super(pos, secondPoint, strokeData, id);
	}

	// helper to retrieve oval coordinates based on angle
	private getOvalCoords(angle: number): XY {
		const c = this.getCenter();
		const r = this.getRadius();
		return {
			x: c.x + r.x * Math.cos(angle),
			y: c.y + r.y * Math.sin(angle),
		};
	}

	private computeClosestPointData(worldCoords: Vec2): {
		closestPoint: Vec2;
		distance: number;
	} {
		let t = 0;

		let minCoords = this.getOvalCoords(t);
		let minDistance: number = worldCoords.distanceTo(minCoords);

		while (t < Math.PI * 2) {
			t += 0.01; // TODO: right now its kinda like magic number. i'd say moving it to config would be better, but  i think the better overall idea would be to use derivatives on distance in the future

			const coords = this.getOvalCoords(t);
			const dist = worldCoords.distanceTo(coords);

			minCoords = dist < minDistance ? coords : minCoords;
			minDistance = Math.min(minDistance, dist);
		}
		return {
			closestPoint: Vec2.fromXY(minCoords),
			distance: minDistance,
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
	public clone(): OvalBoardElement {
		return new OvalBoardElement(this.pos, this.strokeData, this.secondPoint);
	}

	public updateData(payload: UpdateOvalElementData): void {
		if (payload.type !== BoardElementType.Oval)
			throw new Error(
				"Error on updating element: element type doesn't match the type stated in a payload",
			);
		if (payload.secondPoint) this.secondPoint = payload.secondPoint;
	}

	public toUpdateData(): UpdateOvalElementData {
		return {
			type: BoardElementType.Oval,
			secondPoint: this.secondPoint,
		};
	}

	public distanceTo(worldCoords: Vec2): number {
		return this.computeClosestPointData(worldCoords).distance;
	}
	public findClosestPointTo(worldCoords: Vec2): Vec2 {
		return this.computeClosestPointData(worldCoords).closestPoint;
	}

	public toRaw(): RawOvalBoardElement {
		return {
			id: this.id,
			type: BoardElementType.Oval,
			pos: this.pos,
			secondPoint: this.secondPoint,
			strokeData: this.strokeData,
		};
	}

	public getRadius(): XY {
		return {
			x: Math.abs(this.pos.x - this.secondPoint.x) * 0.5,
			y: Math.abs(this.pos.y - this.secondPoint.y) * 0.5,
		};
	}
	public getCenter(): XY {
		return {
			x: (this.pos.x + this.secondPoint.x) * 0.5,
			y: (this.pos.y + this.secondPoint.y) * 0.5,
		};
	}
	
	public static fromRaw(raw: RawOvalBoardElement) {
		return new OvalBoardElement(Vec2.fromXY(raw.pos), raw.strokeData, Vec2.fromXY(raw.secondPoint), raw.id);
	}

	public static fromEncoded(buffer: ArrayBuffer, id: string): OvalBoardElement {
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
		 

		const element = new OvalBoardElement(new Vec2(posX, posY), strokeData, new Vec2(secondPosX, secondPosY), id);
		return element;
	}
}
