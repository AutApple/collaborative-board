import { BaseRenderLayer } from './base.render-layer.js';
import type { BaseBoardElement } from '../../../../shared/board/elements/base.board-element.js';
import type { Camera } from '../../camera/camera.js';

export class BoardElementsRenderLayer extends BaseRenderLayer {
    private elements: BaseBoardElement[] = []; 
    constructor () { super(); }

    private renderElement(ctx: CanvasRenderingContext2D, element: BaseBoardElement, camera: Camera) {
        const points = element.getPoints();
        if (points.length < 2) return;

        const { color, size } = element.getStrokeData();
        ctx.lineWidth = size;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;

        const start = camera.worldToScreen(points[0]!);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i < points.length; i++) {
            const prev = camera.worldToScreen(points[i - 1]!);
            const curr = camera.worldToScreen(points[i]!);

            // calculate midpoint between prev and curr
            const cx = (prev.x + curr.x) / 2;
            const cy = (prev.y + curr.y) / 2;

            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
        }

        // connect to last point
        const last = camera.worldToScreen(points[points.length - 1]!);
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
    }

    public override clear(): void {
        this.elements = [];
    }

    public override updateData(elements: BaseBoardElement[]): void {
        this.elements = elements;
    }
    
    public override render(ctx: CanvasRenderingContext2D, camera: Camera): void {
        for (const element of this.elements)
            this.renderElement(ctx, element, camera);
    }
}