import type { Vec2 } from '../../../types/vec2.type.js';
import type { StrokeData } from '../types/stroke-data.type.js';
import type { BoardElementType } from './types/board-element-type.js';

export interface RawBaseBoardElement {
    type: BoardElementType;
    id: string;
    pos: Vec2;

    strokeData: StrokeData;
}