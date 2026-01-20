import type { Point } from '@shared/types/point.type.js';
import type { Board } from '@shared/board/board.js';
import type { BoardMutationList } from '@shared/board/board-mutation.js';
import type { StrokeData } from '../../../../shared/board/elements/types/stroke-data.type.js';

export abstract class BaseTool {
    constructor(protected board: Board) { }
    public abstract isConstructing(): boolean;
    public abstract startConstructing(worldCoords: Point, strokeData: StrokeData): void;
    public abstract stepConstructing(worldCoords: Point): void;
    public abstract endConstructing(): BoardMutationList | null;
}