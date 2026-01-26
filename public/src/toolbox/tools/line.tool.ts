import { LineBoardElement } from '@shared/board/elements/line-board-element.js';
import type { Vec2 } from '@shared/types/vec2.type.js';
import type { Board } from '@shared/board/board.js';
import { BaseTool } from './base.tool.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation } from '@shared/board/board-mutation.js';
import type { StrokeData } from '@shared/board/elements/types/stroke-data.type.js';
import { ToolResult } from '../tool-result.js';

export class LineTool extends BaseTool {
    constructor(protected board: Board) {
        super(board);
    }

    private constructingLinePointer: LineBoardElement | null = null;

    public override isConstructing(): boolean {
        return !(this.constructingLinePointer === null);
    }

    public override startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null {
        if (this.isConstructing()) return null;
        const line = new LineBoardElement(worldCoords, worldCoords, { ...strokeData });
        this.constructingLinePointer = line;
        return new ToolResult().addBoardAction(board => board.appendElement(line)).addRenderBoardEmit(this.board);
    }

    public override stepConstructing(worldCoords: Vec2): ToolResult | null {
        if (!this.isConstructing()) return null;
        this.constructingLinePointer?.setPosition2(worldCoords);
        return new ToolResult().addRenderBoardEmit(this.board);
    }

    public override endConstructing(): ToolResult | null {
        if (!this.isConstructing()) return null;
        const raw = this.constructingLinePointer!.toRaw();
        const mutation: CreateBoardMutation = {
            type: BoardMutationType.Create,
            id: this.constructingLinePointer!.id,
            raw
        };
        this.constructingLinePointer = null;
        return new ToolResult().setGlobalMutations([mutation]).addRenderBoardEmit(this.board);
    }
}