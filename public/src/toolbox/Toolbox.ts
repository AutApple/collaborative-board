import type { BoardMutationList } from '@shared/board/board-mutation.js';
import type { Point } from '@shared/types/point.type.js';
import type { Board } from '@shared/board/board.js';
import { Tools } from './enums/tools.enum.js';
import type { BaseTool } from './tools/base.tool.js';
import { LineTool } from './tools/line.tool.js';
import { StrokeTool } from './tools/stroke.tool.js';

export class Toolbox {
    private currentTool: BaseTool;   

    public toolInstances: Record<Tools, BaseTool>;
    constructor(private board: Board) { 
        this.currentTool = new StrokeTool(board);
        // make instances of a tools
        this.toolInstances = {
            [Tools.Pen]: new StrokeTool(board),
            [Tools.Line]: new LineTool(board)
        }
    }
    
    changeTool(tool: Tools) {
        this.currentTool = this.toolInstances[tool];
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
    endConstructing(): BoardMutationList | null {
        return this.currentTool.endConstructing();
    }
}