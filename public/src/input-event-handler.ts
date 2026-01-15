import { BoardInputEventHandler } from './board/board.input-event-handler.js';
import { CameraInputEventHandler } from './camera/camera.input-event-handler.js';
import type { AppContext } from './app-context.js';

export class InputEventHandler {
    private boardInputHandler: BoardInputEventHandler;
    private cameraInputHandler: CameraInputEventHandler;

    constructor(appContext: AppContext) {
        this.boardInputHandler = new BoardInputEventHandler(appContext);
        this.cameraInputHandler = new CameraInputEventHandler(appContext);
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