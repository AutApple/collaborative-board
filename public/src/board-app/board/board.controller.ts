import { BoardElementFactory } from '../../../../shared/board-elements/board-element-factory.js';
import type { AppContext } from '../app-context.js';
import type {
	BoardHistoryMutationsEvent,
	BoardMutationsEvent,
	EventBus,
	SemanticEventMap,
} from '../event-bus';
import {
	SemanticEvents,
	type BoardRefreshEvent,
	type BoardResizeEvent,
} from '../event-bus/events/index.js';
import type { NetworkService } from '../network/network.service.js';
import { RenderLayerType } from '../../../../shared/renderer/enums/render-layer.enum.js';

export class BoardController {
	constructor(
		private appContext: AppContext,
		private networkService: NetworkService,
	) {}

	public subscribe(bus: EventBus<SemanticEventMap>) {
		bus.on(SemanticEvents.BoardRefresh, this.onBoardRefresh.bind(this));
		bus.on(SemanticEvents.BoardResize, this.onBoardResize.bind(this));
		bus.on(SemanticEvents.BoardMutations, this.onBoardMutations.bind(this));
		bus.on(SemanticEvents.BoardHistoryMutations, this.onBoardHistoryMutaitons.bind(this));
	}

	private onBoardMutations(e: BoardMutationsEvent) {
		// console.log(`Got mutations!: ${e.mutations}`);
		for (const mutation of e.mutations) this.appContext.board.applyMutation(mutation);

		this.appContext.renderer.setLayerData(
			RenderLayerType.DebugStats,
			this.appContext.board.getDebugStats(),
		);
		this.appContext.renderer.setLayerDataAndRender(
			this.appContext.camera,
			RenderLayerType.Elements,
			this.appContext.board.getElements(),
		);
	}

	private onBoardRefresh(e: BoardRefreshEvent) {
		const data = e.rawData.map((raw) => BoardElementFactory.fromRaw(raw));
		this.appContext.board.refresh(data);

		this.appContext.renderer.setLayerData(
			RenderLayerType.DebugStats,
			this.appContext.board.getDebugStats(),
		);
		this.appContext.renderer.setLayerDataAndRender(
			this.appContext.camera,
			RenderLayerType.Elements,
			this.appContext.board.getElements(),
		);
	}

	private onBoardResize(e: BoardResizeEvent) {
		this.appContext.renderer.resizeCanvas(e.w, e.h);
		this.appContext.renderer.renderAll(this.appContext.camera);
	}

	private onBoardHistoryMutaitons(e: BoardHistoryMutationsEvent) {
		const { mutations } = e;
		for (const mutation of mutations) this.appContext.board.applyMutation(mutation);
		this.networkService.sendBoardMutationList(mutations);
		this.appContext.renderer.setLayerData(
			RenderLayerType.DebugStats,
			this.appContext.board.getDebugStats(),
		);
		this.appContext.renderer.setLayerDataAndRender(
			this.appContext.camera,
			RenderLayerType.Elements,
			this.appContext.board.getElements(),
		);
	}
}
