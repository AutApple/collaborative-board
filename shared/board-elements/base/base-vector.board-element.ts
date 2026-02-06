import type { Vec2 } from '../../utils/vec2.utils.js';
import { BaseBoardElement, type RawBaseBoardElement } from './base.board-element.js';
import type { BoardElementType } from '../types/board-element-type.js';
import type { StrokeData } from '../types/stroke-data.type.js';

export interface RawBaseVectorBoardElement extends RawBaseBoardElement {
	type: BoardElementType;
	strokeData: StrokeData;
}

export abstract class BaseVectorBoardElement extends BaseBoardElement {
	protected strokeData: StrokeData;
	constructor(pos: Vec2, strokeData: StrokeData, id: string | undefined) {
		super(pos, id);
		this.strokeData = { ...strokeData };
	}
	public getStrokeData(): StrokeData {
		return this.strokeData;
	}
	public pickColor(worldCoords: Vec2): string | null {
		const distance = this.findClosestPointTo(worldCoords).distanceTo(worldCoords);
		if (distance > this.getStrokeData().size) return null;
		return this.getStrokeData().color;
	}
}
