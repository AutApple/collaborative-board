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
        return false; 
    }
    public handleMouseMove(e: MouseEvent): boolean { 
        return false; 
    }
    public handleMouseUp(): boolean { 
        return false; 
    }
}