import { BoardEventHandler } from './handlers/board.event-handler.js';
import { CameraEventHandler } from './handlers/camera.event-handler.js';
import type { AppContext } from '../app-context.js';
import { EventBus, type SemanticEventMap } from '../event-bus';
export class EventHandler {
    private boardInputHandler: BoardEventHandler;
    private cameraInputHandler: CameraEventHandler;

    constructor(appContext: AppContext, private semanticEventBus: EventBus<SemanticEventMap>) {
        this.boardInputHandler = new BoardEventHandler(appContext, semanticEventBus);
        this.cameraInputHandler = new CameraEventHandler(appContext, semanticEventBus);
    };

    public registerEvents(canvas: HTMLCanvasElement, target: EventTarget) {
        target.addEventListener("resize", this.handleResize.bind(this));
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this)); 
        canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));

        canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
    }

    public handleMouseDown(e: MouseEvent): void {
        e.preventDefault();
        if (this.boardInputHandler.handleMouseDown(e)) return;
        if (this.cameraInputHandler.handleMouseDown(e)) return;
    }
    
    public handleMouseMove(e: MouseEvent): void {
        if (this.boardInputHandler.handleMouseMove(e)) return;
        if (this.cameraInputHandler.handleMouseMove(e)) return;
    }
    
    public handleMouseUp(): void {
        if (this.boardInputHandler.handleMouseUp()) return;    
        if (this.cameraInputHandler.handleMouseUp()) return;    
    }

    public handleMouseLeave(): void {
        if (this.boardInputHandler.handleMouseLeave()) return;
    }

    public handleMouseWheel(e: WheelEvent): void {
        e.preventDefault();
        if (this.cameraInputHandler.handleMouseWheel(e)) return;
    }

    public handleResize() : void {
        if (this.boardInputHandler.handleResize()) return;
    }
}