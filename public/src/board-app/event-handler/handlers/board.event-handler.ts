import { Vec2 } from '@shared/utils/vec2.utils.js';
import type { AppContext } from '../../app-context.js';
import type { EventBus, SemanticEventMap } from '../../event-bus';
import { SemanticEvents } from '../../event-bus/events/index.js';

export class BoardEventHandler {
	constructor(
		private appContext: AppContext,
		private semanticEventBus: EventBus<SemanticEventMap>,
	) {}

	private endDrawingHandler(): boolean {
		if (!this.appContext.toolbox.isConstructing()) return false; // if board isnt being drawn on, don't consume event
		this.semanticEventBus.emit(SemanticEvents.ToolEndUsing, {});
		return true;
	}

	public handleMouseDown(e: MouseEvent): boolean {
		if (e.button !== 0) return false; // if it's not left button, don't consume event and pass it to the next handler
		this.semanticEventBus.emit(SemanticEvents.ToolStartUsing, {
			screenCoords: new Vec2(e.offsetX, e.offsetY),
		});
		return true;
	}

	public handleMouseMove(e: MouseEvent): boolean {
		if (!this.appContext.toolbox.isConstructing()) return false; // don't consume event, if board is not being  drawn on rn
		this.semanticEventBus.emit(SemanticEvents.ToolProcessUsing, {
			screenCoords: new Vec2(e.offsetX, e.offsetY),
		});
		return true;
	}

	public handleMouseUp(): boolean {
		return this.endDrawingHandler();
	}

	public handleMouseLeave(): boolean {
		return this.endDrawingHandler();
	}

	public handleResize(): boolean {
		this.semanticEventBus.emit(SemanticEvents.BoardResize, {
			w: window.innerWidth,
			h: window.innerHeight,
		});
		return false; // don't consume resize events
	}

	public handleKeyPress(e: KeyboardEvent): boolean {
		if (!e.ctrlKey && !e.metaKey) return false;
		if (e.code === 'KeyZ') this.semanticEventBus.emit(SemanticEvents.BoardHistoryUndoAction, {});
		if (e.code === 'KeyY') this.semanticEventBus.emit(SemanticEvents.BoardHistoryRedoAction, {});
		return false;
	}
}
