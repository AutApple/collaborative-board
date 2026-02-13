import { optimizeMutations, type BoardMutationList } from '../../../../shared/board/board-mutation.js';
import type { Board } from '../../../../shared/board/board.js';
import type { BaseBoardElement } from '../../../../shared/board-elements/base/base.board-element.js';
import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap } from '../event-bus/index.js';
import type { NetworkService } from '../network/network.service.js';

type BoardAction = (board: Board) => void;
type EmitAction = (bus: EventBus<SemanticEventMap>) => void;

enum TemplateAction {
	RerenderBoard,
}

export class ToolResult {
	private globalMutations: BoardMutationList = [];

	private boardActions: BoardAction[] = [];
	private emitActions: EmitAction[] = [];
	private templateActions: TemplateAction[] = []; // template actions are converged to bus emits on apply

	constructor() {} // instanciated from the tool logic code

	public clear() {
		this.globalMutations = [];
		this.boardActions = [];
		this.emitActions = [];
	}
	public setGlobalMutations(mutations: BoardMutationList | null) {
		if (mutations === null) return this;
		this.globalMutations = [...mutations];
		return this;
	}

	public addEmitAction(fn: EmitAction) {
		this.emitActions.push(fn);
		return this;
	}
	public addBoardAction(fn: BoardAction) {
		this.boardActions.push(fn);
		return this;
	}

	public addRenderBoardEmit() {
		this.templateActions.push(TemplateAction.RerenderBoard);
		return this;
	}

	public isEmpty() {
		return (
			this.globalMutations.length === 0 &&
			this.emitActions.length === 0 &&
			this.boardActions.length === 0
		);
	}

	public apply(
		appContext: AppContext,
		networkService: NetworkService,
		bus: EventBus<SemanticEventMap>,
	) {
		// applied in controller
		if (this.isEmpty()) return;

		if (this.globalMutations.length > 0) {
			const optimizedMutations = optimizeMutations(this.globalMutations);
			networkService.sendBoardMutationList(optimizedMutations);
			appContext.boardHistory.registerMutations(optimizedMutations);
		}

		for (const boardAction of this.boardActions) boardAction(appContext.board);
		for (const eventEmit of this.emitActions) eventEmit(bus);
		for (const templateAction of this.templateActions) {
			switch (templateAction) {
				case TemplateAction.RerenderBoard:
					bus.emit(SemanticEvents.RendererRedrawBoard, {
						elements: appContext.board.getElements(),
						debugStats: appContext.board.getDebugStats(),
					});
					break;
			}
		}
	}
}
