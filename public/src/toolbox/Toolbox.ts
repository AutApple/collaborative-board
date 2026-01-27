import type { BoardMutationList } from '@shared/board/board-mutation.js';
import { Vec2 } from '@shared/types/vec2.type.js';
import type { Board } from '@shared/board/board.js';
import { Tools } from './enums/tools.enum.js';
import type { BaseTool } from './tools/base.tool.js';
import { LineTool } from './tools/line.tool.js';
import { StrokeTool } from './tools/stroke.tool.js';
import { EraserTool } from './tools/eraser.tool.js';
import type { StrokeData } from '@shared/board/elements/types/stroke-data.type.js';
import type { ToolResult } from './tool-result.js';
import { EyedropperTool } from './tools/eyedropper.tool.js';

export class Toolbox {
    private currentTool: BaseTool;
    private currentStrokeData: StrokeData;
    public toolInstances: Record<Tools, BaseTool>;
    
    
    constructor(private board: Board) {
        this.currentStrokeData = { // TODO: some config that would define defaults
            color: 'black',
            size: 3
        };

        // make instances of a tools
        this.toolInstances = {
            [Tools.Pen]: new StrokeTool(board),
            [Tools.Line]: new LineTool(board),
            [Tools.Eraser]: new EraserTool(board),
            [Tools.Eyedropper]: new EyedropperTool(board)
        };
        this.currentTool = this.toolInstances[Tools.Pen]; // TODO: some config that would define defaults
    }
    
    changeColor(color: string) {
        this.currentStrokeData.color = color;
    } 
    changeSize(size: number) {
        this.currentStrokeData.size = size;
    }

    changeTool(tool: Tools) {
        this.currentTool = this.toolInstances[tool];
    }
    getCurrentStrokeData(): StrokeData {
        return this.currentStrokeData;
    }

    isConstructing(): boolean {
        return this.currentTool.isConstructing();
    }

    startConstructing(worldCoords: Vec2): ToolResult | null {
        return this.currentTool.startConstructing(worldCoords, this.currentStrokeData);
    }
    stepConstructing(worldCoords: Vec2): ToolResult | null {
        return this.currentTool.stepConstructing(worldCoords);
    }
    endConstructing(): ToolResult | null {
        return this.currentTool.endConstructing();
    }
}