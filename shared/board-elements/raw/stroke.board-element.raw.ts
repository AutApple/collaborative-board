import type { Point } from '../../types/point.type.js';
import type { RawBaseBoardElement } from './base.board-element.raw.js';

export interface RawStrokeBoardElement extends RawBaseBoardElement {
    lastCoords: Point;
    lastTime: number;
    offsets: Point[];
}