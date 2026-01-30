import { BoardMutationType, type CreateBoardMutation } from '../../../../shared/board/board-mutation.js';
import type { Board } from '../../../../shared/board/board.js';
import { StrokeBoardElement } from '../../../../shared/board/elements/stroke.board-element.js';
import type { StrokeData } from '../../../../shared/board/elements/types/stroke-data.type.js';
import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import { ToolResult } from '../tool-result.js';
import { BaseTool } from './base.tool.js';

export class OvalTool extends BaseTool {
    constructor (protected board: Board) { super(board); }
    private constructingOvalPointer: StrokeBoardElement | null = null;

    public isConstructing(): boolean {
        return (this.constructingOvalPointer !== null);
    }

    public getOvalVertices(
        topLeft: Vec2,
        bottomRight: Vec2,
    ): Vec2[] {
        const segments = 32; // TODO: retrieve this number from config
        const cx = (topLeft.x + bottomRight.x) / 2;
        const cy = (topLeft.y + bottomRight.y) / 2;

        const rx = Math.abs(bottomRight.x - topLeft.x) / 2;
        const ry = Math.abs(bottomRight.y - topLeft.y) / 2;

        const vertices: Vec2[] = [];

        for (let i = 0; i < segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            vertices.push(
                new Vec2(
                    cx + rx * Math.cos(t),
                    cy + ry * Math.sin(t)
                )
            );
        }

        // close path
        vertices.push(vertices[0]!);

        return vertices;
    }

    public startConstructing(worldCoords: Vec2, strokeData: StrokeData): ToolResult | null {
        this.constructingOvalPointer = new StrokeBoardElement(worldCoords, strokeData);
        return new ToolResult().addBoardAction((board) => board.appendElement(this.constructingOvalPointer!)).addRenderBoardEmit(this.board);
    }
    public stepConstructing(worldCoords: Vec2): ToolResult | null {
        this.constructingOvalPointer!.setVertices(this.getOvalVertices(this.constructingOvalPointer!.getPosition(), worldCoords));
        return new ToolResult().addRenderBoardEmit(this.board);
    }
    public endConstructing(): ToolResult | null {
        const mutation: CreateBoardMutation = {
                id: this.constructingOvalPointer!.id,
                type: BoardMutationType.Create,
                raw: this.constructingOvalPointer!.toRaw()
        };
        this.constructingOvalPointer = null;
        return new ToolResult().setGlobalMutations([mutation]).addRenderBoardEmit(this.board);
    }

}