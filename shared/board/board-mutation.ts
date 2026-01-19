import type { Point } from '@shared/types/point.type.js';
import type { Board } from './board.js';
import { BoardElementType } from './elements/raw/types/board-element-type.js';
import { LineBoardElement, StrokeBoardElement } from './elements/index.js';
import type { RawBoardElement } from './elements/raw/index.js';
import { rawElementToInstance } from './elements/utils/raw-element-to-instance.js';


const constructorMap = {
    [BoardElementType.Line]: LineBoardElement,
    [BoardElementType.Stroke]: StrokeBoardElement
}

export enum BoardMutationType {
    Create, 
    Update, 
    Remove
};

export interface BaseBoardMutation {
    type: BoardMutationType; 
};

export interface CreateBoardMutation extends BaseBoardMutation {
    type: BoardMutationType.Create;
    id: string;
    raw: RawBoardElement
}

export interface UpdateBoardMutation extends BaseBoardMutation {
    type: BoardMutationType.Update;
    id: string, 
    points: Point[]
}

export interface RemoveBoardMutation extends BaseBoardMutation {
    type: BoardMutationType.Remove;
    id: string, 
}

export type BoardMutationList = Array<BaseBoardMutation> 


export function applyBoardMutation(mutation: BaseBoardMutation, board: Board): { appliedMutation?: BaseBoardMutation; newElementId?: string } {
    switch (mutation.type) {
        case BoardMutationType.Create: 
            const createMutation = mutation as CreateBoardMutation;
            if (!createMutation.raw) throw Error('Wrong create board mutation signature'); // TODO: generic centralized messages
            const element = rawElementToInstance(createMutation.raw);
            board.appendElement(element);
            console.log('Created element with id ', element.id);
            return {appliedMutation: mutation, newElementId: element.id}
        case BoardMutationType.Remove: 
            const removeMutation = mutation as RemoveBoardMutation;
            if (!removeMutation.id) throw Error('Wrong remove board mutation signature');
            board.removeElement(removeMutation.id);
            return {appliedMutation: mutation}
        case BoardMutationType.Update:
            const updateMutation = mutation as UpdateBoardMutation;
            if (!updateMutation.id || !updateMutation.points) throw Error('Wrong remove board mutation signature');
            board.updateElement(updateMutation.id, updateMutation.points);
            return {appliedMutation: mutation}
    }
}

