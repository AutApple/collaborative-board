import type { BaseBoardElement } from '@shared/board/elements/base.board-element.js';
import { StrokeBoardElement } from '@shared/board/elements/stroke.board-element.js';
import type { Point } from '@shared/types/point.type.js';
import type { Board } from '@shared/board/board.js';
import { BaseTool } from './base.tool.js';

export class StrokeTool extends BaseTool{
    constructor (protected board: Board) {
        super(board);
    }

    private constructingStrokePointer: StrokeBoardElement | null = null;
    
    public isConstructing(): boolean {
        return !(this.constructingStrokePointer === null);
    }
    
    public override startConstructing(worldCoords: Point): void {
        if (this.isConstructing()) return;

        const stroke = new StrokeBoardElement(worldCoords, [{ x: 0, y: 0 }]);
        this.constructingStrokePointer = stroke;
        this.board.appendElement(stroke);
    }
    
    public override stepConstructing(worldCoords: Point): void {
        if (!this.isConstructing()) return;
        this.constructingStrokePointer?.addPoint(worldCoords); 
    }

    public override endConstructing(): BaseBoardElement | null {
        if (!this.isConstructing()) return null;
        const ret = this.constructingStrokePointer;
        this.constructingStrokePointer = null;
        return ret;
    }
}