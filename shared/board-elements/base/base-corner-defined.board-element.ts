import { Vec2, type XY } from '../../utils/vec2.utils.js';
import type { BoardElementType } from '../types/board-element-type.js';
import type { StrokeData } from '../types/stroke-data.type.js';
import {
	BaseVectorBoardElement,
	type RawBaseVectorBoardElement,
} from './base-vector.board-element.js';

import type { BaseUpdateElementData } from './base.board-element.js';

export interface BaseUpdateCornerDefinedElementData extends BaseUpdateElementData {
	type: BoardElementType;
	secondPoint: Vec2;
}

export interface RawBaseCornerDefinedBoardElement extends RawBaseVectorBoardElement {
	type: BoardElementType;
	secondPoint: Vec2;
}

export interface RectanglePoints {
	topLeft: XY;
	topRight: XY;
	bottomRight: XY;
	bottomLeft: XY;
}

export abstract class BaseCornerDefinedBoardElement extends BaseVectorBoardElement {
	constructor(
		pos: Vec2,
		protected secondPoint: Vec2,
		strokeData: StrokeData,
		id?: string | undefined,
	) {
		super(pos, strokeData, id);
	}
	public getSecondPoint(): Vec2 {
		return this.secondPoint;
	}
	public setSecondPoint(point: XY): void {
		this.secondPoint = Vec2.fromXY(point);
	}

	public getRectPoints(): RectanglePoints {
		const minX = Math.min(this.pos.x, this.secondPoint.x);
		const minY = Math.min(this.pos.y, this.secondPoint.y);
		const maxX = Math.max(this.pos.x, this.secondPoint.x);
		const maxY = Math.max(this.pos.y, this.secondPoint.y);
		return {
			topLeft: { x: minX, y: minY },
			topRight: { x: maxX, y: minY },
			bottomRight: { x: maxX, y: maxY },
			bottomLeft: { x: minX, y: maxY },
		};
	}
}
