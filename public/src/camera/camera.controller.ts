import type { AppContext } from '../app-context.js';
import type { EventBus } from '../event-bus/event-bus.js';
import { SemanticEvents, type CameraEndPanningEvent, type CameraProcessPanningEvent, type CameraStartPanningEvent, type CameraZoomEvent, type SemanticEventMap } from '../event-bus/index.js';

export class CameraController {
    constructor(private appContext: AppContext) { }

    public subscribe(bus: EventBus<SemanticEventMap>) {
        bus.on(SemanticEvents.CameraStartPanning, this.onCameraStartPanning.bind(this));
        bus.on(SemanticEvents.CameraProcessPanning, this.onCameraProcessPanning.bind(this));
        bus.on(SemanticEvents.CameraEndPanning, this.onCameraEndPanning.bind(this));
        bus.on(SemanticEvents.CameraZoom, this.onCameraZoom.bind(this));
    }

    public onCameraZoom(e: CameraZoomEvent) {
        this.appContext.camera.zoom(e.screenCoords, e.delta);
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
    }

    public onCameraStartPanning(e: CameraStartPanningEvent) {
        this.appContext.camera.startMove(e.screenCoords);
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);

    }

    public onCameraProcessPanning(e: CameraProcessPanningEvent) {
        this.appContext.camera.move(e.screenCoords);
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
    }

    public onCameraEndPanning(e: CameraEndPanningEvent) {
        this.appContext.camera.endMove();
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
    }
}