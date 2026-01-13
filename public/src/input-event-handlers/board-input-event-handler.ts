import type { Socket } from 'socket.io-client';
import type { Board } from '../board/board.js';
import type { Camera } from '../camera.js';
import type { Renderer } from '../renderer.js';
import type { NetworkManager } from '../network-manager.js';

export class BoardInputEventHandler {
    constructor(private board: Board, private camera: Camera, private renderer: Renderer, private networkManager: NetworkManager) { }
    
    private endDrawingHandler(): boolean {
        if (!this.board.isConstructingStroke()) return false; // if board isnt being drawn on, don't consume event 
        
        this.board.endConstructingStroke();
        this.renderer.renderBoard(this.board, this.camera);
        const stroke = this.board.getLastStroke();
        if (stroke !== undefined)
            this.networkManager.addStrokeToBoard(stroke);
           
        return true;
    }
    
    public handleMouseDown(e: MouseEvent): boolean { 
        if (e.button !== 0) return false; // if it's not left button, don't consume event and pass it to the next handler
        this.board.startConstructingStroke(this.camera.screenToWorld({ x: e.offsetX, y: e.offsetY }));
        return true; 
    }
    
    public handleMouseMove(e: MouseEvent): boolean {
        if (!this.board.isConstructingStroke()) return false; // don't consume event, if board is not being  drawn on rn
    
        this.board.processConstructingStroke(this.camera.screenToWorld({ x: e.offsetX, y: e.offsetY }));
        this.renderer.renderBoard(this.board, this.camera);
    
        return true; 
    }
    
    public handleMouseUp(): boolean {
        return this.endDrawingHandler();
    }
    
    public handleMouseLeave(): boolean {
        return this.endDrawingHandler();
    }
    
    public handleResize(): boolean { 
        this.renderer.resizeCanvas(window.innerWidth, window.innerHeight);
        this.networkManager.requestBoardRefresh();
        return false; // don't consume resize events 
    }
}