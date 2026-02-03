import { Vec2 } from '../utils/vec2.utils.js';
import type { BaseBoardElement } from './base/base.board-element.js';
import type { RawBaseBoardElement } from './base/base.board-element.js';
import type { RawStrokeBoardElement } from './stroke.board-element.js';
import { BoardElementType } from './types/board-element-type.js';
import { StrokeBoardElement } from './stroke.board-element.js';
import type { StrokeData } from './types/stroke-data.type.js';
import type { AnyRawBoardElement } from './index.js';
import { OvalBoardElement, type RawOvalBoardElement } from './oval.board-element.js';

export class BoardElementFactory {
	public static fromRaw(raw: AnyRawBoardElement): BaseBoardElement {
		switch (raw.type) {
			case BoardElementType.Stroke:
				return new StrokeBoardElement(
					Vec2.fromXY(raw.pos),
					(raw as RawStrokeBoardElement).strokeData,
					(raw as RawStrokeBoardElement).offsets.map((off) => Vec2.fromXY(off)),
					raw.id,
				);
			case BoardElementType.Oval:
				return new OvalBoardElement(
					Vec2.fromXY(raw.pos),
					(raw as RawOvalBoardElement).strokeData,
					Vec2.fromXY((raw as RawOvalBoardElement).bottomRightPoint),
					raw.id,
				);
		}
	}

	public static fromEncoded(buffer: ArrayBuffer, id: string): BaseBoardElement {
		// check the type
		const view = new DataView(buffer);
		const type: BoardElementType = view.getUint8(0);
		switch (type) {
			case BoardElementType.Stroke:
				return this.strokeFromEncoded(buffer, id);
			case BoardElementType.Oval:
				throw new Error('Not implemented yet');
		}
	}

	private static strokeFromEncoded(buffer: ArrayBuffer, id: string): StrokeBoardElement {
		// 1 byte for element type (uint8),
		// 1 byte for stroke size (uint8),
		// 3 bytes for color data (uint8 * 3),
		// 4 bytes for X and 4 bytes for Y,
		// 4 bytes for each offset x and 4 bytes for offset y
		let byteOffset = 1; // skip type byte cuz its irrelevant
		const view = new DataView(buffer);

		const size = view.getUint8(byteOffset++);
		const r = view.getUint8(byteOffset++);
		const g = view.getUint8(byteOffset++);
		const b = view.getUint8(byteOffset++);
		const color: string =
			'#' +
			r.toString(16).padStart(2, '0') +
			g.toString(16).padStart(2, '0') +
			b.toString(16).padStart(2, '0');
		const strokeData: StrokeData = {
			color,
			size,
		};

		const posX = view.getInt32(byteOffset, true);
		byteOffset += 4;
		const posY = view.getInt32(byteOffset, true);
		byteOffset += 4;

		const offsets: Vec2[] = [];
		const offsetsByteSize = buffer.byteLength - byteOffset;
		if (offsetsByteSize % 8 !== 0) throw Error('Invalid data on decoding stroke');
		const offsetsLength = offsetsByteSize / 8;

		for (let i = 0; i < offsetsLength; i++) {
			const x = view.getInt32(byteOffset, true);
			byteOffset += 4;
			const y = view.getInt32(byteOffset, true);
			byteOffset += 4;
			offsets.push(new Vec2(x, y));
		}

		const element = new StrokeBoardElement(new Vec2(posX, posY), strokeData, offsets, id);
		return element;
	}
}
