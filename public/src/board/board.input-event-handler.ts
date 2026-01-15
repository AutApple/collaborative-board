import type { Board } from './board.js';
import type { Camera } from '../camera/camera.js';
import type { Renderer } from '../renderer.js';
import type { NetworkManager } from '../network-manager.js';
import type { BaseTool } from '../tools/BaseTool.js';
import { LineTool } from '../tools/LineTool.js';

export class BoardInputEventHandler {
    constructor(private board: Board, private camera: Camera, private renderer: Renderer, private networkManager: NetworkManager) { }
    
    private tool: BaseTool = new LineTool(this.board); // TODO: transform BoardInputEventHandler to ToolboxEventHandler

    private endDrawingHandler(): boolean { // TODO: Drawing logic and element type depends on 
        if (!this.tool.isConstructing()) return false; // if board isnt being drawn on, don't consume event 
        
        const element = this.tool.endConstructing();
        this.renderer.renderBoard(this.board, this.camera);
        if (element !== null)
            this.networkManager.addElementToBoard(element); 
    
        return true;
    }
    
    public handleMouseDown(e: MouseEvent): boolean { 
        if (e.button !== 0) return false; // if it's not left button, don't consume event and pass it to the next handler
        this.tool.startConstructing(this.camera.screenToWorld({ x: e.offsetX, y: e.offsetY }));
        return true; 
    }
    
    public handleMouseMove(e: MouseEvent): boolean {
        if (!this.tool.isConstructing()) return false; // don't consume event, if board is not being  drawn on rn
    
        this.tool.stepConstructing(this.camera.screenToWorld({ x: e.offsetX, y: e.offsetY }));
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