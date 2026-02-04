import { Vec2, type XY } from '../utils/vec2.utils.js';
import {
	BaseVectorBoardElement,
	type RawBaseVectorBoardElement,
} from './base/base-vector.board-element.js';
import { type BaseUpdateElementData } from './base/base.board-element.js';
import { BoardElementType } from './types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

export interface UpdateRectangleElementData extends BaseUpdateElementData {
	type: BoardElementType.Rectangle;
	bottomRightPoint: Vec2;
}

export interface RawRectangleBoardElement extends RawBaseVectorBoardElement {
	type: BoardElementType.Rectangle;
	bottomRightPoint: Vec2;
}

export class RectangleBoardElement extends BaseVectorBoardElement {
	public type: BoardElementType = BoardElementType.Rectangle;
	constructor(
		pos: Vec2,
		strokeData: StrokeData,
		protected bottomRightPoint: Vec2,
		id?: string | undefined,
	) {
		super(pos, strokeData, id);
	}

	public getBottomRightPoint(): Vec2 {
		return this.bottomRightPoint;
	}
	public setBottomRightPoint(point: XY): void {
		this.bottomRightPoint = Vec2.fromXY(point);
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
		return new RectangleBoardElement(this.pos, this.strokeData, this.bottomRightPoint);
	}

	public updateData(payload: UpdateRectangleElementData): void {
		if (payload.type !== BoardElementType.Rectangle)
			throw new Error(
				"Error on updating element: element type doesn't match the type stated in a payload",
			);
		if (payload.bottomRightPoint) this.bottomRightPoint = payload.bottomRightPoint;
	}

	public toUpdateData(): UpdateRectangleElementData {
		return {
			type: BoardElementType.Rectangle,
			bottomRightPoint: this.bottomRightPoint,
		};
	}
	public distanceTo(worldCoords: Vec2): number {
		return this.pos.distanceTo(worldCoords);
	}

	public toRaw(): RawRectangleBoardElement {
		return {
			id: this.id,
			type: BoardElementType.Rectangle,
			pos: this.pos,
			bottomRightPoint: this.bottomRightPoint,
			strokeData: this.strokeData,
		};
	}

	public encode(): ArrayBuffer {
		throw new Error('Method not implemented.');
	}
}
