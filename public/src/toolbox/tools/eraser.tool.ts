import { Vec2 } from '@shared/types/vec2.type.js';
import type { Board } from '@shared/board/board.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation, type RemoveBoardMutation, type UpdateBoardMutation } from '@shared/board/board-mutation.js';
import { BaseTool } from './base.tool.js';
import type { StrokeData } from '../../../../shared/board/elements/types/stroke-data.type.js';
import { ToolResult } from '../tool-result.js';
import { SemanticEvents } from '../../event-bus/index.js';

export class EraserTool extends BaseTool {
    private erasing: boolean = false;
    private resultingMutationList: BoardMutationList;
    private eraserRadius = 6; // TODO: controlled by stroke size
    private localToolResult: ToolResult = new ToolResult();

    constructor(protected board: Board) {
        super(board);
        this.resultingMutationList = [];
    }
    private removeElementAndMakeMutation(elementId: string): RemoveBoardMutation {
        this.board.removeElement(elementId);
        return {
            type: BoardMutationType.Remove,
            id: elementId
        };
    }

    private erase(worldCoords: Vec2): BoardMutationList {
        const closestElement = this.board.findClosestElementTo(worldCoords);
        if (!closestElement) return [];
        const { point, distance } = closestElement.findClosestPointTo(worldCoords);
        if (distance > this.eraserRadius) return [];
        // 2 cases  
        // 1 - point is either first or last point of the element. then we just remove the point.
        // 2 - point is in the middle. remove the point. get all of the points after it and put them into the buffer, while removing from the stroke
        // if there is no points left - completely dissolve the element
        // then append new stroke with these saved points
        const allPoints = closestElement.getPoints();
        const idx = allPoints.findIndex(p => p.x === point.x && p.y === point.y);
        if (idx === 0 || idx === (allPoints.length - 1)) {
            const updatedPoints = allPoints.filter((_, i) => i !== idx);

            if (updatedPoints.length < 1)
                return [this.removeElementAndMakeMutation(closestElement.id)];
            this.localToolResult.addBoardAction((board) => { board.updateElement(closestElement.id, updatedPoints )})
            let resMutation: UpdateBoardMutation = {
                type: BoardMutationType.Update,
                id: closestElement.id,
                points: updatedPoints,
            };
            return [resMutation];
        }
        const left = allPoints.slice(0, idx);
        const right = allPoints.slice(idx + 1);
        this.localToolResult.addBoardAction((board) => {
            board.updateElement(closestElement.id, left);
        });
        
        const newElement = closestElement.clone();
        newElement.setPoints(right);
        this.localToolResult.addBoardAction((board) => {
            board.appendElement(newElement);
        })
        
        const updateMutation: UpdateBoardMutation = {
            type: BoardMutationType.Update,
            id: closestElement.id,
            points: left
        };
        const createMutation: CreateBoardMutation = {
            type: BoardMutationType.Create,
            id: newElement.id,
            raw: newElement.toRaw()
        };
        return [updateMutation, createMutation];
    }

    public override isConstructing(): boolean {
        return this.erasing;
    }

    public override startConstructing(worldCoords: Vec2, {size}: StrokeData): ToolResult | null {
        this.localToolResult.clear();
        this.erasing = true;
        this.eraserRadius = size;
        const mutations = this.erase(worldCoords);
        this.resultingMutationList.push(...mutations);

        return this.localToolResult.addRenderBoardEmit(this.board);
    }

    public override stepConstructing(worldCoords: Vec2): ToolResult | null {
        this.localToolResult.clear();
        const mutations = this.erase(worldCoords);
        this.resultingMutationList.push(...mutations);

        return this.localToolResult.addRenderBoardEmit(this.board);
    }

    public override endConstructing(): ToolResult | null{
        this.localToolResult.clear();
        const toolResult = new ToolResult().setGlobalMutations(this.resultingMutationList).addRenderBoardEmit(this.board);
        this.erasing = false;
        this.resultingMutationList = [];
        return toolResult;
    }
}