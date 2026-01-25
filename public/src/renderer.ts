import { Vec2, type XY } from '@shared/types/vec2.type.js';
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

    public getCanvasDimensions(): XY {
        return { x: this.canvas.width, y: this.canvas.height };
    }

    private renderElement(element: BaseBoardElement, camera: Camera) {
        const points = element.getPoints();
        if (points.length < 2) return;

        const { color, size } = element.getStrokeData();
        this.ctx.lineWidth = size;
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = color;

        const start = camera.worldToScreen(points[0]!);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);

        for (let i = 1; i < points.length; i++) {
            const prev = camera.worldToScreen(points[i - 1]!);
            const curr = camera.worldToScreen(points[i]!);

            // calculate midpoint between prev and curr
            const cx = (prev.x + curr.x) / 2;
            const cy = (prev.y + curr.y) / 2;

            this.ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
        }

        // connect to last point
        const last = camera.worldToScreen(points[points.length - 1]!);
        this.ctx.lineTo(last.x, last.y);

        this.ctx.stroke();
    }

    public renderDebugStats(board: Board) {
        const stats = board.getDebugStats();
        this.ctx.fillText(`Overall elements: ${stats.overallElementsAmount}`, 16, 16);
        this.ctx.fillText(`Overall points: ${stats.overallPointsAmount}`, 16, 32);
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