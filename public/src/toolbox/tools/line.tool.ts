import { LineBoardElement } from '@shared/board/elements/line-board-element.js';
import type { Point } from '@shared/types/point.type.js';
import type { Board } from '@shared/board/board.js';
import { BaseTool } from './base.tool.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation } from '@shared/board/board-mutation.js';
import type { StrokeData } from '@shared/board/elements/types/stroke-data.type.js';

export class LineTool extends BaseTool {
    constructor(protected board: Board) {
        super(board);
    }

    private constructingLinePointer: LineBoardElement | null = null;

    public override isConstructing(): boolean {
        return !(this.constructingLinePointer === null);
    }

    public override startConstructing(worldCoords: Point, strokeData: StrokeData): void {
        if (this.isConstructing()) return;

        const line = new LineBoardElement(worldCoords, worldCoords, {... strokeData});
        this.constructingLinePointer = line;
        this.board.appendElement(line);
    }

    public override stepConstructing(worldCoords: Point): void {
        if (!this.isConstructing()) return;
        this.constructingLinePointer?.setPosition2(worldCoords);
    }

    public override endConstructing(): BoardMutationList | null {
        if (!this.isConstructing()) return null;
        const raw = this.constructingLinePointer!.toRaw();
        const mutation: CreateBoardMutation = {
            type: BoardMutationType.Create,
            id: this.constructingLinePointer!.id,
            raw
        };
        this.constructingLinePointer = null;
        return [mutation];
    }
}