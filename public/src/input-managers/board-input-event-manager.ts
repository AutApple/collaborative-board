import type { Socket } from 'socket.io-client';
import type { Board } from '../board.js';
import type { Camera } from '../camera.js';

export class BoardInputEventManager {
    constructor(private board: Board, private camera: Camera, private socket: Socket) { }
    
    private endDrawingHandler(): boolean {
        if (!this.board.isDrawing()) return false; //if board isnt being drawn on, don't consume event 
        this.board.endDraw();
        return true;
    }
    
    public handleMouseDown(e: MouseEvent): boolean { 
        if (e.button !== 0) return false; // if it's not left button, don't consume event and pass it to the next handler
        this.board.startDraw(this.camera.screenToWorld({ x: e.offsetX, y: e.offsetY }));
        return true; 
    }
    
    public handleMouseMove(e: MouseEvent): boolean {
        if (!this.board.isDrawing()) return false; // don't consume event, if board is not being  drawn on rn
        this.board.draw(this.camera.screenToWorld({ x: e.offsetX, y: e.offsetY }));
        return true; 
    }
    
    public handleMouseUp(): boolean {
        return this.endDrawingHandler();
    }
    
    public handleMouseLeave(): boolean {
        return this.endDrawingHandler();
    }
    
    public handleResize(): boolean { 
        this.board.resize(window.innerWidth, window.innerHeight)
        return false; // don't consume resize events 
    }
}