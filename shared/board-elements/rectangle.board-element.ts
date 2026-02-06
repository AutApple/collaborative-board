import type { BoardMutationList } from '../board/board-mutation.js';
import { Vec2, type XY } from '../utils/vec2.utils.js';
import {
	BaseCornerDefinedBoardElement,
	type BaseUpdateCornerDefinedElementData,
	type RawBaseCornerDefinedBoardElement,
} from './base/base-corner-defined.board-element.js';
import {
	BaseVectorBoardElement,
	type RawBaseVectorBoardElement,
} from './base/base-vector.board-element.js';
import { type BaseUpdateElementData } from './base/base.board-element.js';
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
		return this.pos.distanceTo(worldCoords);
	}
	
	public findClosestPointTo(worldCoords: Vec2): Vec2 {
		return new Vec2(0, 0);
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

	public encode(): ArrayBuffer {
		throw new Error('Method not implemented.');
	}

	public pickColor(worldCoords: Vec2): string | null {
		return null;
	}
}
