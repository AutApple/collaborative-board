import { Board } from '../board/board.js';
import { Vec2, type XY } from '../utils/vec2.utils.js';
import {
	BaseVectorBoardElement,
	type RawBaseVectorBoardElement,
} from './base/base-vector.board-element.js';
import {
	BaseBoardElement,
	type BaseUpdateElementData,
	type RawBaseBoardElement,
} from './base/base.board-element.js';
import type { AnyUpdateElementData, AnyRawBoardElement } from './index.js';
import { BoardElementType } from './types/board-element-type.js';
import type { StrokeData } from './types/stroke-data.type.js';

export interface UpdateOvalElementData extends BaseUpdateElementData {
	type: BoardElementType.Oval;
	bottomRightPoint: Vec2;
}

export interface RawOvalBoardElement extends RawBaseVectorBoardElement {
	type: BoardElementType.Oval;
	bottomRightPoint: Vec2;
}

export class OvalBoardElement extends BaseVectorBoardElement {
	public type: BoardElementType = BoardElementType.Oval;
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
	public clone(): OvalBoardElement {
		return new OvalBoardElement(this.pos, this.strokeData, this.bottomRightPoint);
	}

	public updateData(payload: UpdateOvalElementData): void {
		if (payload.type !== BoardElementType.Oval)
			throw new Error(
				"Error on updating element: element type doesn't match the type stated in a payload",
			);
		if (payload.bottomRightPoint) this.bottomRightPoint = payload.bottomRightPoint;
	}

	public toUpdateData(): UpdateOvalElementData {
		return {
			type: BoardElementType.Oval,
			bottomRightPoint: this.bottomRightPoint,
		};
	}
	public distanceTo(worldCoords: Vec2): number {
		return this.pos.distanceTo(worldCoords);
	}

	public toRaw(): RawOvalBoardElement {
		return {
			id: this.id,
			type: BoardElementType.Oval,
			pos: this.pos,
			bottomRightPoint: this.bottomRightPoint,
			strokeData: this.strokeData,
		};
	}

	public encode(): ArrayBuffer {
		throw new Error('Method not implemented.');
	}
}
