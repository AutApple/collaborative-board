import { Board } from './board/board.js';
import type { Camera } from './camera/camera.js';
import { BoardInputEventHandler } from './board/board.input-event-handler.js';
import { CameraInputEventHandler } from './camera/camera.input-event-handler.js';
import type { Renderer } from './renderer.js';
import type { NetworkManager } from './network-manager.js';

export class InputEventHandler {
    private boardInputHandler: BoardInputEventHandler;
    private cameraInputHandler: CameraInputEventHandler;

    constructor(private networkManager: NetworkManager, private renderer: Renderer, private board: Board, private camera: Camera) {
        this.boardInputHandler = new BoardInputEventHandler(board, camera, renderer, networkManager);
        this.cameraInputHandler = new CameraInputEventHandler(camera, board, renderer);
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