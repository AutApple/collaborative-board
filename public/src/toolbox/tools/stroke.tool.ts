import { StrokeBoardElement } from '@shared/board/elements/stroke.board-element.js';
import { Vec2 } from '@shared/utils/vec2.utils.js';
import type { Board } from '@shared/board/board.js';
import { BaseTool } from './base.tool.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation } from '@shared/board/board-mutation.js';
import type { StrokeData } from '@shared/board/elements/types/stroke-data.type.js';
import { ToolResult } from '../tool-result.js';

export class StrokeTool extends BaseTool {
    constructor(protected board: Board) {
        super(board);
    }

    private constructingStrokePointer: StrokeBoardElement | null = null;

    public override isConstructing(): boolean {
        return !(this.constructingStrokePointer === null);
    }

    public override startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null {
        const stroke = new StrokeBoardElement(worldCoords, { ...strokeData }, [new Vec2(0, 0)]);
        this.constructingStrokePointer = stroke;
        
        return new ToolResult().addBoardAction((board) => board.appendElement(stroke)).addRenderBoardEmit(this.board);
    }

    public override stepConstructing(worldCoords: Vec2): ToolResult | null {
        this.constructingStrokePointer?.addVertex(worldCoords);

        return new ToolResult().addRenderBoardEmit(this.board);
    }

    public override endConstructing(): ToolResult | null {
        this.constructingStrokePointer!.optimizeVertices(); // optimize vertices
        const raw = this.constructingStrokePointer!.toRaw();
        const mutation: CreateBoardMutation = {
            type: BoardMutationType.Create,
            id: this.constructingStrokePointer!.id,
            raw
        };
        this.constructingStrokePointer = null;
        return new ToolResult().setGlobalMutations([mutation]).addRenderBoardEmit(this.board);
    }
}