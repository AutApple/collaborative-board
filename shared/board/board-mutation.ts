import type { Point } from '@shared/types/point.type.js';
import type { Board } from './board.js';
import { BoardElementType } from './elements/raw/types/board-element-type.js';
import { LineBoardElement, StrokeBoardElement } from './elements/index.js';
import type { RawBoardElement } from './elements/raw/index.js';
import { rawElementToInstance } from './elements/utils/raw-element-to-instance.js';


const constructorMap = {
    [BoardElementType.Line]: LineBoardElement,
    [BoardElementType.Stroke]: StrokeBoardElement
};

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
    raw: RawBoardElement;
}

export interface UpdateBoardMutation extends BaseBoardMutation {
    type: BoardMutationType.Update;
    id: string,
    points: Point[];
}

export interface RemoveBoardMutation extends BaseBoardMutation {
    type: BoardMutationType.Remove;
    id: string,
}

export type BoardMutationList = Array<BaseBoardMutation>;
export function optimizeMutations(list: BoardMutationList) {
    // if there are different CHANGE operations on the same id - should keep only the last one.
    // if the object with some id essentially gets deleted - any other operations with that object before doesn't make sense, thus can be removed.
    // if the object is created and then have some changes, there is no point in applying these changes. just create an object with the points that are in the last change mutation

}