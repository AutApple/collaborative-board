import { BoardMutationType, type CreateBoardMutation } from '../../../../shared/board/board-mutation.js';
import type { Board, ReadonlyBoard } from '../../../../shared/board/board.js';
import { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';
import type { StrokeData } from '../../../../shared/board-elements/types/stroke-data.type.js';
import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import { ToolResult } from '../tool-result.js';
import { BaseTool } from './base.tool.js';

export class RectangleTool extends BaseTool {
    constructor (readonly board: ReadonlyBoard) { super(board); }
    private constructingSquarePointer: StrokeBoardElement | null = null;

    public isConstructing(): boolean {
        return (this.constructingSquarePointer !== null);
    }

    public getRectVertices(topLeft: Vec2, bottomRight: Vec2): Vec2[] {
        
        const direction = bottomRight.sub(topLeft);
        
        direction.x = Math.sign(direction.x);
        direction.y = Math.sign(direction.y);

        return [
            topLeft,
            new Vec2(topLeft.x + direction.x, topLeft.y),     
            new Vec2(bottomRight.x, topLeft.y), // make up additional vertices because renderer uses curves
            new Vec2(bottomRight.x, topLeft.y + direction.y), 
            bottomRight, 
            new Vec2(bottomRight.x - direction.x, bottomRight.y),
            new Vec2(topLeft.x, bottomRight.y), 
            new Vec2(topLeft.x, bottomRight.y - direction.y),
            topLeft
        ];
    }

    public startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null {
        this.constructingSquarePointer = new StrokeBoardElement(worldCoords, strokeData);
        return new ToolResult().addBoardAction((board) => board.appendElement(this.constructingSquarePointer!)).addRenderBoardEmit();
    }
    public stepConstructing(worldCoords: Vec2): ToolResult | null {
        if (!this.isConstructing()) return null;
        this.constructingSquarePointer!.setVertices(this.getRectVertices(this.constructingSquarePointer!.getPosition(), worldCoords));
        return new ToolResult().addRenderBoardEmit();
    }
    public endConstructing(): ToolResult | null {
        if (!this.isConstructing()) return null;
        const mutation: CreateBoardMutation = {
                id: this.constructingSquarePointer!.id,
                type: BoardMutationType.Create,
                raw: this.constructingSquarePointer!.toRaw()
        };
        this.constructingSquarePointer = null;
        return new ToolResult().setGlobalMutations([mutation]).addRenderBoardEmit();
    }

}