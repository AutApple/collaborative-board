import type { Point } from '../../types/point.type.js';
import type { BoardElementType } from './types/board-element-type.js';

export interface RawBaseBoardElement {
    type: BoardElementType;
    pos: Point;
}