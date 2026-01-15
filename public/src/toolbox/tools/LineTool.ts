import type { BaseBoardElement } from '../../../../shared/board-elements/base.board-element.js';
import { LineBoardElement } from '../../../../shared/board-elements/line-board-element.js';
import { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';
import type { Point } from '../../../../shared/types/point.type.js';
import type { Board } from '../../board/board.js';
import { BaseTool } from './BaseTool.js';

export class LineTool extends BaseTool{
    constructor (protected board: Board) {
        super(board);
    }

    private constructingLinePointer: LineBoardElement | null = null;
    
    public isConstructing(): boolean {
        return !(this.constructingLinePointer === null);
    }
    
    public override startConstructing(worldCoords: Point): void {
        if (this.isConstructing()) return;

        const line = new LineBoardElement(worldCoords, worldCoords);
        this.constructingLinePointer = line;
        this.board.appendElement(line);
    }
    
    public override stepConstructing(worldCoords: Point): void {
        if (!this.isConstructing()) return;
        this.constructingLinePointer?.setPosition2(worldCoords); 
    }

    public override endConstructing(): BaseBoardElement | null {
        if (!this.isConstructing()) return null;
        const ret = this.constructingLinePointer;
        this.constructingLinePointer = null;
        return ret;
    }
}