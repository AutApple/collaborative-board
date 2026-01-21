import { BoardMutationType, type BaseBoardMutation, type BoardMutationList, type CreateBoardMutation, type RemoveBoardMutation, type UpdateBoardMutation } from '../../../shared/board/board-mutation.js';
import { rawElementToInstance } from '../../../shared/board/elements/utils/raw-element-to-instance.js';


// update L1
// create L2


// remove L2 

class BoardAction {
    constructor(private mutations: BoardMutationList) { }

    public getMutations(): BoardMutationList {
        return this.mutations;
    }

    private static findInverseMutation(mutation: BaseBoardMutation, mutationList: BoardMutationList): BaseBoardMutation | null {
        // TODO: make this less sphagetti-code 
        // Find inverted mutation for the corresponding mutation in mutation list. Return null if its not possible to find 
        // Inverted mutation cases:
        // 1.) It was create mutation. Simply make remove mutation and return it.
        // 2.) It was remove mutation. In that case, find CreateMutation, get raw from it, then find last update mutation and set raw points to that update mutation. Return it.
        // 3.) It was change mutation. Find the previous update/create mutation, and set it's points to a new update mutation. Return it.
        switch (mutation.type) {
            case BoardMutationType.Create:
                return {
                    id: mutation.id,
                    type: BoardMutationType.Remove
                } as RemoveBoardMutation;
            case BoardMutationType.Remove:
                let createMutation, lastUpdateMutation;
                let maxIdx = -1;
                for (let i = 0; i < mutationList.length; i++) {
                    if (mutationList[i]!.id === mutation.id && mutationList[i]!.type === BoardMutationType.Create)
                        createMutation = mutationList[i] as CreateBoardMutation;
                    if (mutationList[i]!.id === mutation.id && mutationList[i]!.type === BoardMutationType.Update && i > maxIdx) {
                        lastUpdateMutation = mutationList[i] as UpdateBoardMutation;
                        maxIdx = i;
                    }
                }
                if (!createMutation || !lastUpdateMutation) return null;
                const element = rawElementToInstance(createMutation.raw);
                element.setPoints(lastUpdateMutation.points);

                return {
                    id: mutation.id,
                    type: BoardMutationType.Create,
                    raw: element.toRaw(),
                } as CreateBoardMutation;
            case BoardMutationType.Update:
                for (let i = mutationList.length - 1; i >= 0; i--) {
                    const isUpdateMutation = mutationList[i]!.type === BoardMutationType.Update;
                    const isCreateMutation = mutationList[i]!.type === BoardMutationType.Create;
                    if (mutationList[i]!.id === mutation.id && (isUpdateMutation || isCreateMutation)) {
                        if (isCreateMutation) {
                            const m = mutationList[i]! as CreateBoardMutation;
                            const element = rawElementToInstance(m.raw);
                            const points = element.getPoints();
                            return {
                                id: mutation.id,
                                type: BoardMutationType.Update,
                                points: [... points],
                            } as UpdateBoardMutation;
                        }
                        const m = mutationList[i]! as UpdateBoardMutation;
                        return {
                            id: m.id,
                            type: m.type,
                            points: [...m.points]
                        } as UpdateBoardMutation;
                    }
                }
                return null;
        }
    }

    public findInverseAction(actionList: BoardAction[]): BoardAction | null {
        const mutationList: BoardMutationList = [];
        for (const action of actionList)
            mutationList.push(...action.getMutations());
        const resultingMutations: BoardMutationList = [];

        // For each mutation in the action
        for (const mutation of this.mutations) {
            const inverse = BoardAction.findInverseMutation(mutation, mutationList);
            if (!inverse) return null;
            resultingMutations.push(inverse);
        }
        return new BoardAction(resultingMutations);
    }
}

export class BoardHistory {
    private undoStack: BoardAction[] = [];
    private redoStack: BoardAction[] = [];

    public registerMutations(mutations: BoardMutationList): void {
        this.redoStack = [];
        this.undoStack.push(new BoardAction(mutations));
        console.log(`New action! ${mutations.map(m => `[With ID: ${m.id}, do ${m.type}] | `)}`)
    }
    public retrieveUndo(): BoardMutationList | null {
        const lastAction = this.undoStack.pop();
        if (!lastAction) return null;
        this.redoStack.push(lastAction);
        const inverseAction = lastAction.findInverseAction(this.undoStack);
        if (!inverseAction) return null;
        return inverseAction.getMutations(); 
    }

    public retrieveRedo(): BoardMutationList | null {
        const redoAction = this.redoStack.pop();
        if (!redoAction) return null;
        this.undoStack.push(redoAction);
        return redoAction.getMutations();
    }

}