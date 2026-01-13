import type { Socket } from 'socket.io-client';
import type { Camera } from '../camera.js';
import type { Board } from '../board.js';

export class CameraInputEventManager {
    constructor (private camera: Camera, private board: Board, private socket: Socket) {}
    public handleMouseWheel (e: WheelEvent): boolean { 
        if (!e.ctrlKey) return false; // check if ctrl key is pressed
        this.camera.zoom({x: e.offsetX, y: e.offsetY }, e.deltaY);
        this.board.refresh();
        return true;
    }
    public handleMouseDown (e: MouseEvent): boolean { 
        if (e.button !== 1) return false; // handle mouse down only on middle button
        this.camera.startMove({ x: e.offsetX, y: e.offsetY });
        this.board.refresh();
        return true; 
    }
    public handleMouseMove(e: MouseEvent): boolean { 
        if (e.button !== 1 && !this.camera.isPanning()) return false; // handle mouse move only on middle button and only if camera is being panned
        
        this.camera.move({ x: e.offsetX, y: e.offsetY });
        this.board.refresh();
        
        return true; 
    }
    public handleMouseUp(): boolean { 
        if (!this.camera.isPanning()) return false;
       
        this.camera.endMove();
        this.board.refresh();
       
        return true; 
    }
}