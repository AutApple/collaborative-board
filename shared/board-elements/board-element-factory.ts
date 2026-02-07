import type { BaseBoardElement } from './base/base.board-element.js';
import type { AnyRawBoardElement } from './index.js';
import { OvalBoardElement, type RawOvalBoardElement } from './oval.board-element.js';
import { RectangleBoardElement, type RawRectangleBoardElement } from './rectangle.board-element.js';
import type { RawStrokeBoardElement } from './stroke.board-element.js';
import { StrokeBoardElement } from './stroke.board-element.js';
import { BoardElementType } from './types/board-element-type.js';

export class BoardElementFactory {
	public static fromRaw(raw: AnyRawBoardElement): BaseBoardElement {
		switch (raw.type) {
			case BoardElementType.Stroke:
				return StrokeBoardElement.fromRaw(raw as RawStrokeBoardElement);
			case BoardElementType.Oval:
				return OvalBoardElement.fromRaw(raw as RawOvalBoardElement);
			case BoardElementType.Rectangle:
				return RectangleBoardElement.fromRaw(raw as RawRectangleBoardElement);
		}
	}

	public static fromEncoded(buffer: ArrayBuffer, id: string): BaseBoardElement {
		// check the type
		const view = new DataView(buffer);
		const type: BoardElementType = view.getUint8(0);
		switch (type) {
			case BoardElementType.Stroke:
				return StrokeBoardElement.fromEncoded(buffer, id);
			case BoardElementType.Oval:
				return OvalBoardElement.fromEncoded(buffer, id);
			case BoardElementType.Rectangle:
				return RectangleBoardElement.fromEncoded(buffer, id);
		}
	}
}
