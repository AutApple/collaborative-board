import type { AppContext } from '../../app-context.js';
import { SemanticEvents, type EventBus, type SemanticEventMap } from '../../event-bus';

export class CameraEventHandler {
    constructor (private appContext: AppContext,  private semanticEventBus: EventBus<SemanticEventMap>) {}
    public handleMouseWheel (e: WheelEvent): boolean { 
        if (!e.ctrlKey) return false; // check if ctrl key is pressed
        
        this.semanticEventBus.emit(SemanticEvents.CameraZoom, {screenCoords: {x: e.offsetX, y: e.offsetY }, delta: e.deltaY });
        
        return true;
    }
    public handleMouseDown (e: MouseEvent): boolean { 
        if (e.button !== 1) return false; // handle mouse down only on middle button
        
        this.semanticEventBus.emit(SemanticEvents.CameraStartPanning, {screenCoords: { x: e.offsetX, y: e.offsetY }});
        
        return true; 
    }
    
    public handleMouseMove(e: MouseEvent): boolean { 
        if (e.button !== 1 && !this.appContext.camera.isPanning()) return false; // handle mouse move only on middle button and only if camera is being panned
        
        this.semanticEventBus.emit(SemanticEvents.CameraProcessPanning, {screenCoords: { x: e.offsetX, y: e.offsetY }});

        return true; 
    }

    public handleMouseUp(): boolean { 
        if (!this.appContext.camera.isPanning()) return false;
        this.semanticEventBus.emit(SemanticEvents.CameraEndPanning, {});
        return true; 
    }
}