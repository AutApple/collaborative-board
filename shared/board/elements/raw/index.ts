import type { RawBaseBoardElement } from './base.board-element.raw.js';
import type { RawLineBoardElement } from './line.board-element.raw.js';
import type { RawStrokeBoardElement } from './stroke.board-element.raw.js';

export * from './base.board-element.raw.js';
export * from './stroke.board-element.raw.js';
export * from './line.board-element.raw.js';

export type RawBoardElement = RawStrokeBoardElement | RawBaseBoardElement | RawLineBoardElement;