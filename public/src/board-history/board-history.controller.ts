import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type BoardHistoryRedoActionEvent, type BoardHistoryUndoActionEvent, type SemanticEventMap } from '../event-bus/index.js';

export class BoardHistoryController {
    bus: EventBus<SemanticEventMap> | undefined;
    constructor (private appContext: AppContext) {}
    public subscribe(bus: EventBus<SemanticEventMap>) {
        this.bus = bus;
        bus.on(SemanticEvents.BoardHistoryRedoAction, this.onRedoAction.bind(this));
        bus.on(SemanticEvents.BoardHistoryUndoAction, this.onUndoAction.bind(this));
        
    }

    private onRedoAction(_: BoardHistoryRedoActionEvent) {
        if (!this.bus) return;
        console.log('Goes to controller')
        const mutation = this.appContext.boardHistory.retrieveRedo();
        if (!mutation) return;
        this.bus.emit(SemanticEvents.BoardHistoryMutation, { mutation });
    }

    private onUndoAction(_: BoardHistoryUndoActionEvent) {
        if (!this.bus) return;
        console.log('Goes to controller')
        
        const mutation = this.appContext.boardHistory.retrieveUndo();
        if (!mutation) return;
        this.bus.emit(SemanticEvents.BoardHistoryMutation, { mutation });
    }
}