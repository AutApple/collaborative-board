import { Vec2 } from '@shared/types/vec2.type.js';
import { BaseBoardElement } from '@shared/board/elements/';
import type { Board } from '@shared/board/board.js';
import type { Camera } from './camera/camera.js';

export class Renderer {
    private ctx: CanvasRenderingContext2D;
    constructor(private canvas: HTMLCanvasElement) {
        const _ctx = canvas.getContext('2d');
        if (!_ctx) throw Error('Can\'t get 2D context of a canvas');
        this.ctx = _ctx;
        this.resizeCanvas(window.innerWidth, window.innerHeight);
    }

    public resizeCanvas(w: number, h: number) {
        this.canvas.width = w;
        this.canvas.height = h;
    }

    private renderElement(element: BaseBoardElement, camera: Camera) {
        const points = element.getPoints();
        if (points[0] === undefined) return;
        let lastScreenCoords: Vec2 = camera.worldToScreen(points[0]);
        for (const point of points) {
            // convert world coords to local coords
            const screenCoords = camera.worldToScreen(point);

            const {color, size} = element.getStrokeData();
            this.ctx.lineWidth = size;
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = color;

            this.ctx.beginPath();
            this.ctx.moveTo(lastScreenCoords.x, lastScreenCoords.y);
            this.ctx.lineTo(screenCoords.x, screenCoords.y);
            this.ctx.stroke();

            lastScreenCoords.set(screenCoords);
        }
    }
    public renderDebugStats(board: Board) {
        const stats = board.getDebugStats(); 
        this.ctx.fillText(`Overall elements: ${stats.overallElementsAmount}`, 16, 16)
        this.ctx.fillText(`Overall points: ${stats.overallPointsAmount}`, 16, 32)

    }

    public renderBoard(board: Board, camera: Camera) {
        this.clear();
        const elements: BaseBoardElement[] = board.getElements();
        for (const element of elements)
            this.renderElement(element, camera);

        this.renderDebugStats(board);   
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}