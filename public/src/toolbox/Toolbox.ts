import type { BaseBoardElement } from '../../../shared/board-elements/base.board-element.js';
import type { Point } from '../../../shared/types/point.type.js';
import type { Board } from '../board/board.js';
import { ToolboxTools } from './enums/toolbox-tools.enum.js';
import type { BaseTool } from './tools/base.tool.js';
import { LineTool } from './tools/line.tool.js';
import { StrokeTool } from './tools/stroke.tool.js';

export class Toolbox {
    private currentTool: BaseTool;   

    public toolInstances: Record<ToolboxTools, BaseTool>;
    constructor(private board: Board) { 
        this.currentTool = new StrokeTool(board);
        // make instances of a tools
        this.toolInstances = {
            [ToolboxTools.Pen]: new StrokeTool(board),
            [ToolboxTools.Line]: new LineTool(board)
        }
    }
    
    changeTool(tool: ToolboxTools) {
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
    endConstructing(): BaseBoardElement | null {
        return this.currentTool.endConstructing();
    }
}