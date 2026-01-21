import type { Vec2 } from '../../../types/vec2.type.js';
import type { RawBaseBoardElement } from './base.board-element.raw.js';
import type { BoardElementType } from './types/board-element-type.js';

export interface RawStrokeBoardElement extends RawBaseBoardElement {
    type: BoardElementType.Stroke;
    lastCoords: Vec2;
    lastTime: number;
    offsets: Vec2[];
}