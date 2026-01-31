import type { Vec2 } from '../../../utils/vec2.utils.js';
import type { RawBaseBoardElement } from './base.board-element.raw.js';
import type { BoardElementType } from './types/board-element-type.js';

export interface RawStrokeBoardElement extends RawBaseBoardElement {
    type: BoardElementType.Stroke;
    offsets: Vec2[];
}