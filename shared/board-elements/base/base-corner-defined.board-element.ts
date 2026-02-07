import { Vec2, type XY } from '../../utils/vec2.utils.js';
import { BoardElementType } from '../types/board-element-type.js';
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

	public encode(): ArrayBuffer {
		// 1 byte for element type (uint8),
		// 1 byte for stroke size (uint8),
		// 3 bytes for color data (uint8 * 3),
		// 4  bytes for X and 4 bytes for Y,
		// 4 bytes for second point's X and Y 
		const buffer = new ArrayBuffer(1 + 1 + 3 + 8 + 8);
		const view = new DataView(buffer);

		let byteCount = 0;

		view.setUint8(byteCount++, this.type);
		view.setUint8(byteCount++, this.strokeData.size);

		const [r, g, b] = BaseCornerDefinedBoardElement.hexToRgbBytes(this.strokeData.color);

		view.setUint8(byteCount++, r);
		view.setUint8(byteCount++, g);
		view.setUint8(byteCount++, b);

		view.setInt32(byteCount, this.pos.x, true); byteCount += 4;
		view.setInt32(byteCount, this.pos.y, true); byteCount += 4;
		view.setInt32(byteCount, this.secondPoint.x, true); byteCount += 4;
		view.setInt32(byteCount, this.secondPoint.y, true); byteCount += 4;

		return buffer;
	}
}
