import { Canvas } from 'canvas';
import type { Board } from '../../../shared/board/board.js';
import { BoardElementsRenderLayer } from '../../../shared/renderer/layers/board-elements.render-layer.js';
import { Camera } from '../../../shared/camera/camera.js';
import { Vec2 } from '../../../shared/utils/vec2.utils.js';

export class ServerRenderer {
    constructor() {}
    
    // don't see any reason to make this as full-blown service + make rendering board method non-static yet
    public static renderBoardToBytes(board: Board): Uint8Array<ArrayBuffer> {
        const elementsLayer = new BoardElementsRenderLayer();
        const canvas = new Canvas(800, 800); 
                
        const ctx = canvas.getContext('2d');
        const camera = new Camera(new Vec2(0, 0), 1.0, 1.0, 1.0);
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 800, 800);
        
        elementsLayer.updateData(board.getElements());
        elementsLayer.render(ctx, camera);

        const buffer = canvas.toBuffer('image/png');
        return new Uint8Array(buffer); 
    }
}