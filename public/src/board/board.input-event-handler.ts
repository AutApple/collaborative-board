import type { AppContext } from '../app-context.js';

export class BoardInputEventHandler {
    constructor(private appContext: AppContext) { }

    private endDrawingHandler(): boolean { // TODO: Drawing logic and element type depends on 
        if (!this.appContext.toolbox.isConstructing()) return false; // if board isnt being drawn on, don't consume event 

        const element = this.appContext.toolbox.endConstructing();
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
        if (element !== null)
            this.appContext.networkManager.addElementToBoard(element);

        return true;
    }

    public handleMouseDown(e: MouseEvent): boolean {
        if (e.button !== 0) return false; // if it's not left button, don't consume event and pass it to the next handler
        this.appContext.toolbox.startConstructing(this.appContext.camera.screenToWorld({ x: e.offsetX, y: e.offsetY }));
        return true;
    }

    public handleMouseMove(e: MouseEvent): boolean {
        if (!this.appContext.toolbox.isConstructing()) return false; // don't consume event, if board is not being  drawn on rn

        this.appContext.toolbox.stepConstructing(this.appContext.camera.screenToWorld({ x: e.offsetX, y: e.offsetY }));
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);

        return true;
    }

    public handleMouseUp(): boolean {
        return this.endDrawingHandler();
    }

    public handleMouseLeave(): boolean {
        return this.endDrawingHandler();
    }

    public handleResize(): boolean {
        this.appContext.renderer.resizeCanvas(window.innerWidth, window.innerHeight);
        this.appContext.networkManager.requestBoardRefresh();
        return false; // don't consume resize events 
    }
}