import type { BaseBoardElement } from '../../../../shared/board-elements/base.board-element.js';
import type { Point } from '../../../../shared/types/point.type.js';
import type { Board } from '../../board/board.js';

export class BaseTool {
    constructor (protected board: Board) {}
    public isConstructing(): boolean { return false; }
    public startConstructing(worldCoords: Point): void { } 
    public stepConstructing(worldCoords: Point): void { }
    public endConstructing(): BaseBoardElement | null { return null; }

}