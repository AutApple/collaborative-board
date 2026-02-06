import type { BaseBoardElement } from '@shared/board-elements/index.js';
import {
	BoardMutationType,
	type BoardMutationList,
	type RemoveBoardMutation,
} from '@shared/board/board-mutation.js';
import type { ToolResult } from '../../../tool-result.js';

export abstract class BaseRemoveEraserStrategy {
	static apply(element: BaseBoardElement, toolResult: ToolResult): BoardMutationList {
		toolResult.addBoardAction((board) => {
			board.removeElement(element.id);
		});
		const mutation = {
			type: BoardMutationType.Remove,
			id: element.id,
		} as RemoveBoardMutation;
		return [mutation];
	}
}
