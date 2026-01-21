import type { BoardMutationList } from '@shared/board/board-mutation.js';
import type { Point } from '@shared/types/point.type.js';
import type { Board } from '@shared/board/board.js';
import { Tools } from './enums/tools.enum.js';
import type { BaseTool } from './tools/base.tool.js';
import { LineTool } from './tools/line.tool.js';
import { StrokeTool } from './tools/stroke.tool.js';
import { EraserTool } from './tools/eraser.tool.js';
import type { StrokeData } from '@shared/board/elements/types/stroke-data.type.js';

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
            [Tools.Eraser]: new EraserTool(board)
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

    isConstructing(): boolean {
        return this.currentTool.isConstructing();
    }

    startConstructing(worldCoords: Point): void {
        return this.currentTool.startConstructing(worldCoords, this.currentStrokeData);
    }
    stepConstructing(worldCoords: Point): void {
        return this.currentTool.stepConstructing(worldCoords);
    }
    endConstructing(): BoardMutationList | null {
        return this.currentTool.endConstructing();
    }
}