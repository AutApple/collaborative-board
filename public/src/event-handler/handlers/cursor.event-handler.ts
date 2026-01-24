import { Vec2 } from '../../../../shared/types/vec2.type.js';
import type { EventBus } from '../../event-bus/event-bus.js';
import { SemanticEvents, type SemanticEventMap } from '../../event-bus/index.js';

export class CursorEventHandler {
    constructor(private semanticEventBus: EventBus<SemanticEventMap>) { }

    public handleMouseMove(e: MouseEvent): boolean {
        this.semanticEventBus.emit(SemanticEvents.LocalCursorMove, { screenCoords: new Vec2(e.offsetX, e.offsetY) });
        return false; // don't consume that, obviously
    }

}