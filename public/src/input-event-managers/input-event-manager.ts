import type { Socket } from 'socket.io-client';
import { Board } from '../board/board.js';
import type { Camera } from '../camera.js';
import { BoardInputEventManager } from './board-input-event-manager.js';
import { CameraInputEventManager } from './camera-input-event-manager.js';
import type { Renderer } from '../renderer.js';

export class InputEventManager {
    private boardInputManager: BoardInputEventManager;
    private cameraInputManager: CameraInputEventManager;

    constructor(private socket: Socket, private renderer: Renderer, private board: Board, private camera: Camera) {
        this.boardInputManager = new BoardInputEventManager(board, camera, renderer, this.socket);
        this.cameraInputManager = new CameraInputEventManager(camera, board, renderer, this.socket);
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
        if (this.boardInputManager.handleMouseDown(e)) return;
        if (this.cameraInputManager.handleMouseDown(e)) return;
    }
    
    public handleMouseMove(e: MouseEvent): void {
        if (this.boardInputManager.handleMouseMove(e)) return;
        if (this.cameraInputManager.handleMouseMove(e)) return;
    }
    
    public handleMouseUp(): void {
        if (this.boardInputManager.handleMouseUp()) return;    
        if (this.cameraInputManager.handleMouseUp()) return;    
    }

    public handleMouseLeave(): void {
        if (this.boardInputManager.handleMouseLeave()) return;
    }

    public handleMouseWheel(e: WheelEvent): void {
        e.preventDefault();
        if (this.cameraInputManager.handleMouseWheel(e)) return;
    }

    public handleResize() : void {
        if (this.boardInputManager.handleResize()) return;
    }
}