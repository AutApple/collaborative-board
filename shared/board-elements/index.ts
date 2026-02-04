import type { RawOvalBoardElement, UpdateOvalElementData } from './oval.board-element.js';
import type {
	RawRectangleBoardElement,
	UpdateRectangleElementData,
} from './rectangle.board-element.js';
import type { RawStrokeBoardElement, UpdateStrokeElementData } from './stroke.board-element.js';

export * from './base/base.board-element.js';
export * from './stroke.board-element.js';

export type AnyRawBoardElement =
	| RawStrokeBoardElement
	| RawOvalBoardElement
	| RawRectangleBoardElement;
export type AnyUpdateElementData =
	| UpdateStrokeElementData
	| UpdateOvalElementData
	| UpdateRectangleElementData;
