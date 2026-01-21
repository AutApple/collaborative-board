import { StrokeBoardElement } from '@shared/board/elements/stroke.board-element.js';
import { Vec2 } from '@shared/types/vec2.type.js';
import type { Board } from '@shared/board/board.js';
import { BaseTool } from './base.tool.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation } from '@shared/board/board-mutation.js';
import type { StrokeData } from '@shared/board/elements/types/stroke-data.type.js';

export class StrokeTool extends BaseTool {
    constructor(protected board: Board) {
        super(board);
    }

    private constructingStrokePointer: StrokeBoardElement | null = null;

    public override isConstructing(): boolean {
        return !(this.constructingStrokePointer === null);
    }

    public override startConstructing(worldCoords: Vec2, strokeData: StrokeData): void {
        if (this.isConstructing()) return;

        const stroke = new StrokeBoardElement(worldCoords, {... strokeData}, [new Vec2(0, 0)]);
        this.constructingStrokePointer = stroke;
        this.board.appendElement(stroke);
    }

    public override stepConstructing(worldCoords: Vec2): void {
        if (!this.isConstructing()) return;
        this.constructingStrokePointer?.addPoint(worldCoords);
    }

    public override endConstructing(): BoardMutationList | null {
        if (!this.isConstructing()) return null;
        this.constructingStrokePointer!.optimizePoints(); // optimize points 
        const raw = this.constructingStrokePointer!.toRaw();
        const mutation: CreateBoardMutation = {
            type: BoardMutationType.Create,
            id: this.constructingStrokePointer!.id,
            raw
        };
        this.constructingStrokePointer = null;
        return [mutation];
    }
}