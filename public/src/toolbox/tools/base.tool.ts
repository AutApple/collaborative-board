import type { Vec2 } from '@shared/utils/vec2.utils.js';
import type { Board } from '@shared/board/board.js';
import type { StrokeData } from '../../../../shared/board/elements/types/stroke-data.type.js';
import { ToolResult } from '../tool-result.js';

export abstract class BaseTool {
    constructor(protected board: Board) { }

    public abstract isConstructing(): boolean;
    public abstract startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null;
    public abstract stepConstructing(worldCoords: Vec2): ToolResult | null;
    public abstract endConstructing(): ToolResult | null;
}