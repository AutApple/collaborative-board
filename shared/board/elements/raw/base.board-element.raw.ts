import type { Vec2 } from '../../../utils/vec2.utils.js';
import type { StrokeData } from '../types/stroke-data.type.js';
import type { BoardElementType } from './types/board-element-type.js';

export interface RawBaseBoardElement {
    type: BoardElementType;
    id: string;
    pos: Vec2;

    strokeData: StrokeData;
}