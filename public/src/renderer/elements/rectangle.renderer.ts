import type { RectangleBoardElement } from '../../../../shared/board-elements/rectangle.board-element.js';
import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import type { Camera } from '../../camera/camera.js';

export class RectangleRenderer {
         private static normalizeWorldRect(a: Vec2, b: Vec2) {
            const minX = Math.min(a.x, b.x);
            const minY = Math.min(a.y, b.y);
            const maxX = Math.max(a.x, b.x);
            const maxY = Math.max(a.y, b.y);
    
            return {
                topLeft: new Vec2(minX, minY),
                topRight: new Vec2(maxX, minY),
                bottomRight: new Vec2(maxX, maxY),
                bottomLeft: new Vec2(minX, maxY),
            };
        }
        static render(
            ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
            element: RectangleBoardElement,
            camera: Camera,
        ) {
            const aWorld = element.position;
            const bWorld = element.getBottomRightPoint();
    
            const rect = this.normalizeWorldRect(aWorld, bWorld);
    
            const a = camera.worldToScreen(rect.topLeft);
            const b = camera.worldToScreen(rect.topRight);
            const c = camera.worldToScreen(rect.bottomRight);
            const d = camera.worldToScreen(rect.bottomLeft);
    
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.lineTo(d.x, d.y);
            ctx.closePath();
    
            const { size, color } = element.getStrokeData();
    
            ctx.lineWidth = size;
            ctx.strokeStyle = color;
    
            ctx.stroke();
            ctx.restore();
        }
}