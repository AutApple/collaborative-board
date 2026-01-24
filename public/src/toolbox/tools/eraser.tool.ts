import { Vec2 } from '@shared/types/vec2.type.js';
import type { Board } from '@shared/board/board.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation, type RemoveBoardMutation, type UpdateBoardMutation } from '@shared/board/board-mutation.js';
import { BaseTool } from './base.tool.js';
import type { StrokeData } from '../../../../shared/board/elements/types/stroke-data.type.js';

export class EraserTool extends BaseTool {
    private erasing: boolean = false;
    private resultingMutationList: BoardMutationList;
    private eraserRadius = 6; // TODO: controlled by stroke size

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

            this.board.updateElement(closestElement.id, updatedPoints);
            let resMutation: UpdateBoardMutation = {
                type: BoardMutationType.Update,
                id: closestElement.id,
                points: updatedPoints,
            };
            return [resMutation];
        }
        const left = allPoints.slice(0, idx);
        const right = allPoints.slice(idx + 1);
        this.board.updateElement(closestElement.id, left);

        const newElement = closestElement.clone();
        newElement.setPoints(right);
        this.board.appendElement(newElement);

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

    public override startConstructing(worldCoords: Vec2, {size}: StrokeData): void {
        this.erasing = true;
        this.eraserRadius = size;
        const mutations = this.erase(worldCoords);
        this.resultingMutationList.push(...mutations);
    }

    public override stepConstructing(worldCoords: Vec2): void {
        const mutations = this.erase(worldCoords);
        this.resultingMutationList.push(...mutations);
    }

    public override endConstructing(): BoardMutationList | null {
        this.erasing = false;
        const returnValue = [...this.resultingMutationList];
        this.resultingMutationList = [];
        return returnValue;
    }
}