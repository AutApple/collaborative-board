import type { Point } from '../../types/point.type.js';
import type { RawBaseBoardElement } from './base.board-element.raw.js';
import type { BoardElementType } from './types/board-element-type.js';

export interface RawLineBoardElement extends RawBaseBoardElement {
    type: BoardElementType.Line;
    pos2: Point;
}