import type { RawBaseBoardElement } from './base.board-element.raw.js';
import type { RawStrokeBoardElement } from './stroke.board-element.raw.js';

export * from './base.board-element.raw.js';
export * from './stroke.board-element.raw.js';

export type RawBoardElement = RawStrokeBoardElement | RawBaseBoardElement ;