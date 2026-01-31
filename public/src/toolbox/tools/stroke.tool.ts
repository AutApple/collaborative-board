import { StrokeBoardElement } from '@shared/board/elements/stroke.board-element.js';
import { Vec2, type XY } from '@shared/utils/vec2.utils.js';
import type { Board, ReadonlyBoard } from '@shared/board/board.js';
import { BaseTool } from './base.tool.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation } from '@shared/board/board-mutation.js';
import type { StrokeData } from '@shared/board/elements/types/stroke-data.type.js';
import { ToolResult } from '../tool-result.js';
import { clientConfiguration } from '../../config/client.config.js';

export class StrokeTool extends BaseTool {
    constructor(readonly board: ReadonlyBoard) {
        super(board);
    }

    private constructingStrokePointer: StrokeBoardElement | null = null;
    private lastCoords: Vec2 = new Vec2(0, 0);

    public override isConstructing(): boolean {
        return !(this.constructingStrokePointer === null);
    }

    private checkDistanceThreshold(worldCoords: Vec2) {
        if (this.lastCoords.distanceTo(worldCoords) < clientConfiguration.strokeToolDistanceThreshold) return false;
        return true;
    }

    public override startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null {
        const stroke = new StrokeBoardElement(worldCoords, { ...strokeData }, [new Vec2(0, 0)]);
        this.constructingStrokePointer = stroke;
        this.lastCoords.set(worldCoords);
        return new ToolResult().addBoardAction((board) => board.appendElement(stroke)).addRenderBoardEmit();
    }

    public override stepConstructing(worldCoords: Vec2): ToolResult | null {
        if (!this.checkDistanceThreshold(worldCoords)) return null; 

        this.constructingStrokePointer?.addVertex(worldCoords);
        this.lastCoords.set(worldCoords);

        return new ToolResult().addRenderBoardEmit();
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
        return new ToolResult().setGlobalMutations([mutation]).addRenderBoardEmit();
    }
}