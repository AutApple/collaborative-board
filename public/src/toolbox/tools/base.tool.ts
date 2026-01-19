import type { Point } from '@shared/types/point.type.js';
import type { Board } from '@shared/board/board.js';
import type { BoardMutationList } from '@shared/board/board-mutation.js';

export class BaseTool {
    constructor (protected board: Board) {}
    public isConstructing(): boolean { return false; }
    public startConstructing(worldCoords: Point): void { } 
    public stepConstructing(worldCoords: Point): void { }
    public endConstructing(): BoardMutationList | null { return null; }

}