import type { XY } from '../../utils/vec2.utils.js';

export interface Cursor {
    clientId: string, 
    worldCoords: XY
};