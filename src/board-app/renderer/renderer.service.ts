import { Canvas } from 'canvas';
import type { Board } from '../../../shared/board/board.js';
import { BoardElementsRenderLayer } from '../../../shared/renderer/layers/board-elements.render-layer.js';
import { Camera } from '../../../shared/camera/camera.js';
import { Vec2 } from '../../../shared/utils/vec2.utils.js';

export class ServerRendererService {
    constructor(private canvasWidth:number = 1920, private canvasHeight:number = 1080) {}
    
    public renderBoardToBytes(board: Board): Uint8Array<ArrayBuffer> {
        const elementsLayer = new BoardElementsRenderLayer();
        const canvas = new Canvas(this.canvasWidth, this.canvasHeight); 
                
        const ctx = canvas.getContext('2d');
        const camera = new Camera(new Vec2(0, 0), 1.0, 1.0, 1.0);
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        elementsLayer.updateData(board.getElements());
        elementsLayer.render(ctx, camera);

        const buffer = canvas.toBuffer('image/png');
        return new Uint8Array(buffer); 
    }
}