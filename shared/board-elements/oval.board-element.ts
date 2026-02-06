import type { BoardMutationList } from '../board/board-mutation.js';
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

	public encode(): ArrayBuffer {
		throw new Error('Method not implemented.');
	}

	public pickColor(worldCoords: Vec2): string | null {
		return null;
	}
}
