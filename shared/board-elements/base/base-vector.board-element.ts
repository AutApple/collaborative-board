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

	// For encoding color 
	protected static hexToRgbBytes(hex: string): [number, number, number] {
		if (!/^#?[0-9a-fA-F]{6}$/.test(hex)) {
			throw new Error('Invalid hex color');
		}

		if (hex.startsWith('#')) {
			hex = hex.slice(1);
		}

		return [
			parseInt(hex.slice(0, 2), 16), // R
			parseInt(hex.slice(2, 4), 16), // G
			parseInt(hex.slice(4, 6), 16), // B
		];
	}

	// For decoding color
	protected static rgbBytesToHex(r: number, g: number, b: number): string {
		return '#' +
			r.toString(16).padStart(2, '0') +
			g.toString(16).padStart(2, '0') +
			b.toString(16).padStart(2, '0');
	}

	public getStrokeData(): StrokeData {
		return this.strokeData;
	}
	public pickColor(worldCoords: Vec2): string | null {
		const distance = this.findClosestPointTo(worldCoords).distanceTo(worldCoords);
		if (distance > this.getStrokeData().size) return null;
		return this.getStrokeData().color;
	}

	public abstract findClosestPointTo(worldCoords: Vec2): Vec2;
}
