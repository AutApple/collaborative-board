import type { Point } from '@shared/types/point.type.js';
import type { Board } from '@shared/board/board.js';
import { BoardMutationType, type BoardMutationList, type CreateBoardMutation, type RemoveBoardMutation, type UpdateBoardMutation } from '@shared/board/board-mutation.js';
import { BaseTool } from './base.tool.js';

export class EraserTool extends BaseTool{
    private erasing: boolean = false;
    private resultingMutationList: BoardMutationList;
    private eraserRadius = 6; // TODO: controller by stroke size

    constructor (protected board: Board) { 
        super(board);
        this.resultingMutationList = []; 
    }
    private removeElementAndMakeMutation(elementId: string): RemoveBoardMutation {
        this.board.removeElement(elementId);
        return {
            type: BoardMutationType.Remove,
            id: elementId
        }
    }

    private erase(worldCoords: Point): BoardMutationList {
        const closestElement = this.board.findClosestElementTo(worldCoords);
        if (!closestElement) return [];
        const {point, distance} = closestElement.findClosestPointTo(worldCoords);
        if (distance > this.eraserRadius) return [];
        // 2 cases  
        // 1 - point is either first or last point of the element. then we just remove the point.
        // 2 - point is in the middle. remove the point. get all of the points after it and put them into the buffer, while removing from the stroke
        // if there is no points left - completely dissolve the element
        // then append new stroke with these saved points
        const allPoints = closestElement.getPoints();
        const idx = allPoints.findIndex(p => p.x === point.x && p.y === point.y);
        if (idx === 0 || idx === (allPoints.length - 1)) {
            console.log('Erasing end')
            const updatedPoints =  allPoints.filter((_, i) => i !== idx);
            
            if (updatedPoints.length < 1) 
                return [ this.removeElementAndMakeMutation(closestElement.getId) ];
            
            this.board.updateElement(closestElement.getId, updatedPoints);
            let resMutation: UpdateBoardMutation = {
                type: BoardMutationType.Update,
                id: closestElement.getId,
                points: updatedPoints,
            }
            return [resMutation];  
        }
        console.log('Erasing in-between');
        const left = allPoints.slice(0, idx);
        const right = allPoints.slice(idx + 1);
        this.board.updateElement(closestElement.getId, left);
        
        const newElement = closestElement.clone();
        newElement.setPoints(right);
        this.board.appendElement(newElement);

        const updateMutation: UpdateBoardMutation = {
            type: BoardMutationType.Update,
            id: closestElement.getId,
            points: left
        }
        const createMutation: CreateBoardMutation = {
           type: BoardMutationType.Create,
           id: newElement.getId,
           raw: newElement.toRaw() 
        }
        return [updateMutation, createMutation];
    }

    public isConstructing(): boolean { 
        return this.erasing; 
    }
    
    public startConstructing(worldCoords: Point): void { 
        this.erasing = true;
        const mutations = this.erase(worldCoords);
        this.resultingMutationList.push(... mutations);
    } 
    
    public stepConstructing(worldCoords: Point): void { 
        const mutations = this.erase(worldCoords);
        this.resultingMutationList.push(... mutations);
    }

    public endConstructing(): BoardMutationList | null { 
        this.erasing = false;
        const returnValue = [...this.resultingMutationList]
        this.resultingMutationList = [];
        console.log('return value: ', returnValue);
        return returnValue; 
    }

}