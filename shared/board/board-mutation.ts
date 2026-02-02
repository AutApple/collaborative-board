import type { Vec2 } from '@shared/utils/vec2.utils.js';
import type { RawBoardElement } from '../board-elements/raw/index.js';
import { BaseBoardElement } from '../board-elements/base.board-element.js';

export enum BoardMutationType {
    Create,
    Update,
    Remove
};

export interface BaseBoardMutation {
    type: BoardMutationType;
    id: string;
};

export interface CreateBoardMutation extends BaseBoardMutation {
    type: BoardMutationType.Create;
    raw: RawBoardElement;
}

export interface UpdateBoardMutation extends BaseBoardMutation {
    type: BoardMutationType.Update;
    points: Vec2[];
}

export interface RemoveBoardMutation extends BaseBoardMutation {
    type: BoardMutationType.Remove;
}

export type BoardMutationList = Array<BaseBoardMutation>;

export function optimizeMutations(mutations: BoardMutationList): BoardMutationList {
    // console.log(`Optimizing mutaitons. Mutations before optimization: [${mutations.map(m => `T: ${m.type}, ID: ${m.id}; `)}]`)
    const lastMutationIdxDictionary: Map<string, number> = new Map(); // element id index pair
    
    for (let i = 0; i < mutations.length; i++)
        if(mutations[i]!.type !== BoardMutationType.Create)
            lastMutationIdxDictionary.set(mutations[i]!.id, i);
    

    mutations = mutations.filter((m, i) => {
        if (m.type === BoardMutationType.Create) return true;
        return lastMutationIdxDictionary.get(m.id) === i;
    });

    const createMutationsIdxDictionary: Map<string, number> = new Map(); //element id index pair for create ops
    for (let i = 0; i < mutations.length; i++) 
        if (mutations[i]!.type === BoardMutationType.Create)
            createMutationsIdxDictionary.set(mutations[i]!.id, i);
    
    // create id and delete id where ids are equal => nothing happens, cancel these out
    // create id and change id where ids are equal => merge into single create id 
    const idxToDelete: Map<number, boolean> = new Map();
    for (let i = 0; i < mutations.length; i ++) {
        const currentId = mutations[i]!.id;
        const createMutationIndex = createMutationsIdxDictionary.get(currentId);
        if(createMutationIndex !== undefined && createMutationIndex !== i) {
            switch(mutations[i]!.type) {
                case BoardMutationType.Update:
                    idxToDelete.set(i, true);
                    const createMutation = (mutations[createMutationIndex] as CreateBoardMutation)!; 
                    const element = BaseBoardElement.fromRaw(createMutation.raw);
                    element.setVertices((mutations[i] as UpdateBoardMutation)!.points);
                    createMutation.raw = element.toRaw();
                    break;
                case BoardMutationType.Remove:
                    idxToDelete.set(i, true);
                    idxToDelete.set(createMutationIndex, true);
                    break;
            }
        }
    }
    // last cleanup
    mutations = mutations.filter((_, i) => {
        return idxToDelete.get(i) !== true
    });

    // console.log(`Optimized mutaitons. Mutations after optimization: [${mutations.map(m => `T: ${m.type}, ID: ${m.id}; `)}]`)
    return mutations;
}