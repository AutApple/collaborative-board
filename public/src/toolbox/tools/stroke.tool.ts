import { StrokeBoardElement } from '@shared/board/elements/stroke.board-element.js';
import type { Point } from '@shared/types/point.type.js';
import type { Board } from '@shared/board/board.js';
import { BaseTool } from './base.tool.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation } from '@shared/board/board-mutation.js';
import { BoardElementType } from '@shared/board/elements/raw/types/board-element-type.js';

export class StrokeTool extends BaseTool{
    constructor (protected board: Board) {
        super(board);
    }

    private constructingStrokePointer: StrokeBoardElement | null = null;
    
    public override isConstructing(): boolean {
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

    public override endConstructing(): BoardMutationList | null {
        if (!this.isConstructing()) return null;
        const raw = this.constructingStrokePointer!.toRaw();
        const mutation: CreateBoardMutation = {
            type: BoardMutationType.Create,
            id: this.constructingStrokePointer!.getId,
            raw
        }
        this.constructingStrokePointer = null;
        return [ mutation ];
    }
}