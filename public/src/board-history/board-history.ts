import { BoardMutationType, type BaseBoardMutation, type BoardMutationList, type CreateBoardMutation, type RemoveBoardMutation, type UpdateBoardMutation } from '../../../shared/board/board-mutation.js';
import { rawElementToInstance } from '../../../shared/board/elements/utils/raw-element-to-instance.js';


export class BoardHistory {
    private undoStack: BaseBoardMutation[] = [];
    private redoStack: BaseBoardMutation[] = [];

    public registerMutations(mutations: BoardMutationList): void {
        this.redoStack = [];
        for (const mutation of mutations)
            this.undoStack.push(mutation);
    }
    public retrieveUndo(): BaseBoardMutation | null {
        const initialMutation = this.undoStack.pop();
        if (!initialMutation) return null;
        this.redoStack.push(initialMutation);

        // Create inverted mutation based on what was the last action.
        // Inverted mutation cases:
        // 1.) It was create mutation. Simply make remove mutation and return it.
        // 2.) It was remove mutation. In that case, find CreateMutation, get raw from it, then find last update mutation and set raw points to that update mutation. Return it.
        // 3.) It was change mutation. Find the previous update/create mutation, and set it's points to a new update mutation. Return it.
        
        switch(initialMutation.type) {
            case BoardMutationType.Create:
                return {
                    id: initialMutation.id,
                    type: BoardMutationType.Remove
                } as RemoveBoardMutation;
            case BoardMutationType.Remove:
                let createMutation, lastUpdateMutation;
                let maxIdx = -1;  
                for (let i = 0; i < this.undoStack.length; i++) {
                    if (this.undoStack[i]!.id === initialMutation.id && this.undoStack[i]!.type === BoardMutationType.Create) 
                        createMutation = this.undoStack[i] as CreateBoardMutation;
                    if (this.undoStack[i]!.id === initialMutation.id && this.undoStack[i]!.type === BoardMutationType.Update && i > maxIdx) {
                        lastUpdateMutation = this.undoStack[i] as UpdateBoardMutation;
                        maxIdx = i;
                    }
                }
                if (!createMutation || !lastUpdateMutation) return null;
                const element = rawElementToInstance(createMutation.raw); 
                element.setPoints(lastUpdateMutation.points);
                
                return {
                    id: initialMutation.id, 
                    type: BoardMutationType.Create,
                    raw: element.toRaw(),
                } as CreateBoardMutation; 
            case BoardMutationType.Update:
                for (let i = this.undoStack.length - 1; i >= 0; i--) {
                    const isUpdateMutation =  this.undoStack[i]!.type === BoardMutationType.Update;
                    const isCreateMutation = this.undoStack[i]!.type === BoardMutationType.Create;
                    if(this.undoStack[i]!.id === initialMutation.id && (isUpdateMutation || isCreateMutation)) {
                        if (isCreateMutation) {
                            const m = this.undoStack[i]! as CreateBoardMutation;
                            const element = rawElementToInstance(m.raw);
                            const points = element.getPoints();
                            return {
                                id: initialMutation.id,
                                type: BoardMutationType.Update,
                                points,
                            } as UpdateBoardMutation;
                        }
                        const m = this.undoStack[i]! as UpdateBoardMutation;
                        return {
                            id: m.id,
                            type: m.type,
                            points: [... m.points]
                        } as UpdateBoardMutation;
                    }    
                }
                return null; 
        }
    } 

    public retrieveRedo(): BaseBoardMutation | null {
        const redoMutation = this.redoStack.pop();
        if (!redoMutation) return null;
        return redoMutation; 
    } 

}