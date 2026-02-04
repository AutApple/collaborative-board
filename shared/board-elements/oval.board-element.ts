import { Vec2, type XY } from '../utils/vec2.utils.js';
import {
	BaseCornerDefinedBoardElement,
	type RawBaseCornerDefinedBoardElement,
	type BaseUpdateCornerDefinedElementData,
} from './base/base-corner-defined.board-element.js';
import {
	BaseVectorBoardElement,
	type RawBaseVectorBoardElement,
} from './base/base-vector.board-element.js';
import { type BaseUpdateElementData } from './base/base.board-element.js';
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
		return this.pos.distanceTo(worldCoords);
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

	public encode(): ArrayBuffer {
		throw new Error('Method not implemented.');
	}
}
