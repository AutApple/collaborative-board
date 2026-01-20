import type { Point } from '../../../types/point.type.js';
import type { StrokeData } from '../types/stroke-data.type.js';
import type { BoardElementType } from './types/board-element-type.js';

export interface RawBaseBoardElement {
    type: BoardElementType;
    id: string;
    pos: Point;

    strokeData: StrokeData;
}