import {
	BoardMutationType,
	type BoardMutationList,
	type CreateBoardMutation,
	type RemoveBoardMutation,
	type UpdateBoardMutation,
} from '../../../../shared/board/board-mutation.js';

export class BoardAction {
	private mutations: BoardMutationList;
	private inverseMutations: BoardMutationList;

	constructor(mutationList: BoardMutationList) {
		this.mutations = [...mutationList];
		this.inverseMutations = [];
		this.makeInverseMutations(this.mutations);
	}

	public getMutations(): BoardMutationList {
		return [...this.mutations];
	}
	public getInverseMutations(): BoardMutationList {
		return [...this.inverseMutations];
	}

	private makeInverseMutations(mutationList: BoardMutationList) {
		// Create => Delete
		// Delete => Create with previous data
		// Update => Update to previous data
		for (const mutation of mutationList) {
			switch (mutation.type) {
				case BoardMutationType.Create:
					const createMutation = mutation as CreateBoardMutation;
					this.inverseMutations.unshift({
						id: createMutation.id,
						type: BoardMutationType.Remove,
						element: createMutation.element,
					} as RemoveBoardMutation);
					break;
				case BoardMutationType.Update:
					const updateMutation = mutation as UpdateBoardMutation;

					this.inverseMutations.unshift({
						id: updateMutation.id,
						type: BoardMutationType.Update,
						payload: updateMutation.inversePayload,
						inversePayload: updateMutation.payload,
					} as UpdateBoardMutation);
					break;
				case BoardMutationType.Remove:
					const removeMutation = mutation as RemoveBoardMutation;
					this.inverseMutations.unshift({
						id: removeMutation.id,
						type: BoardMutationType.Create,
						element: removeMutation.element,
					} as CreateBoardMutation);
					break;
			}
		}
	}
}

export class BoardHistory {
	private undoStack: BoardAction[] = [];
	private redoStack: BoardAction[] = [];

	public registerMutations(mutations: BoardMutationList): void {
		this.redoStack = [];
		this.undoStack.push(new BoardAction(mutations));
	}
	public retrieveUndo(): BoardMutationList | null {
		const undoAction = this.undoStack.pop();
		if (!undoAction) return null;

		this.redoStack.push(undoAction);
		return undoAction.getInverseMutations();
	}

	public retrieveRedo(): BoardMutationList | null {
		const redoAction = this.redoStack.pop();
		if (!redoAction) return null;

		this.undoStack.push(redoAction);
		return redoAction.getMutations();
	}
}
