import type { Point } from '../../shared/types/point.type.js';
import { Stroke } from '../../shared/types/stroke.type.js';
import type { Board } from './board/board.js';
import type { Camera } from './camera.js';

export class Renderer {
    private ctx: CanvasRenderingContext2D;
    constructor (private canvas: HTMLCanvasElement) {
        const _ctx = canvas.getContext('2d');
        if (!_ctx) throw Error('Can\'t get 2D context of a canvas');
        this.ctx = _ctx;
        this.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    public resizeCanvas(w: number, h: number) {
        this.canvas.width = w;
        this.canvas.height = h;
    }

    private renderStroke(stroke: Stroke, camera: Camera) {
        const points = stroke.points;
        if (points[0] === undefined) return;
        let lastScreenCoords: Point =  camera.worldToScreen(points[0]);
        for (const point of points) {
            // convert world coords to local coords
            const screenCoords = camera.worldToScreen(point);
            
            // TODO: STORING STROKE DATA IN STROKE CLASS
            this.ctx.lineWidth = 6;
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = "black";

            this.ctx.beginPath();
            this.ctx.moveTo(lastScreenCoords.x, lastScreenCoords.y);
            this.ctx.lineTo(screenCoords.x, screenCoords.y);
            this.ctx.stroke();

            lastScreenCoords = { ...screenCoords };
        }
    }
    
    public renderBoard (board: Board, camera: Camera) {
        this.clear();
        const strokes: Stroke[] = board.getStrokes();
        const strokeBuffer: Point[] = board.getStrokeBuffer();

        for (const stroke of strokes)
           this.renderStroke(stroke, camera);
    
        this.renderStroke(new Stroke(strokeBuffer), camera); // unless i add StreamableStrokeElement, i'll use that workaround of dynamically creaing stroke
    }
    
    public clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}