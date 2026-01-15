import type { AppContext } from '../app-context.js';

export class CameraInputEventHandler {
    constructor (private appContext: AppContext) {}
    public handleMouseWheel (e: WheelEvent): boolean { 
        if (!e.ctrlKey) return false; // check if ctrl key is pressed
        
        this.appContext.camera.zoom({x: e.offsetX, y: e.offsetY }, e.deltaY);
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
        
        return true;
    }
    public handleMouseDown (e: MouseEvent): boolean { 
        if (e.button !== 1) return false; // handle mouse down only on middle button
        
        this.appContext.camera.startMove({ x: e.offsetX, y: e.offsetY });
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);

        return true; 
    }
    
    public handleMouseMove(e: MouseEvent): boolean { 
        if (e.button !== 1 && !this.appContext.camera.isPanning()) return false; // handle mouse move only on middle button and only if camera is being panned
        
        this.appContext.camera.move({ x: e.offsetX, y: e.offsetY });
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);

        return true; 
    }

    public handleMouseUp(): boolean { 
        if (!this.appContext.camera.isPanning()) return false;
       
        this.appContext.camera.endMove();
        this.appContext.renderer.renderBoard(this.appContext.board, this.appContext.camera);
       
        return true; 
    }
}