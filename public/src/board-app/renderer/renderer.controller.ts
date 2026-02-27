import type { AppContext } from '../app-context.js';
import {
	SemanticEvents,
	type EventBus,
	type RendererRedrawBoardEvent,
	type SemanticEventMap,
} from '../event-bus/index.js';

export class RendererController {
	constructor(private appContext: AppContext) {}
	public subscribe(bus: EventBus<SemanticEventMap>) {
		bus.on(SemanticEvents.RendererRedrawBoard, this.onRendererRedrawBoard.bind(this));
	}
	onRendererRedrawBoard(e: RendererRedrawBoardEvent) {
		this.appContext.renderer.refreshBoardLayersAndRender(
			this.appContext.camera,
			e.elements,
			e.debugStats,
		);
	}
}
