import type { BaseBoardElement } from '../../../shared/board-elements/base.board-element.js';
import type { Point } from '../../../shared/types/point.type.js';
import type { Board } from '../board/board.js';
import type { BaseTool } from './tools/BaseTool.js';
import { StrokeTool } from './tools/StrokeTool.js';

export class Toolbox {
    private currentTool: BaseTool;     
    
    constructor(private board: Board) { 
        this.currentTool = new StrokeTool(board);
    }
    isConstructing(): boolean {
        return this.currentTool.isConstructing();
    }

    startConstructing(worldCoords: Point): void {
        return this.currentTool.startConstructing(worldCoords);
    }
    stepConstructing(worldCoords: Point): void {
        return this.currentTool.stepConstructing(worldCoords);
    }
    endConstructing(): BaseBoardElement | null {
        return this.currentTool.endConstructing();
    }
}