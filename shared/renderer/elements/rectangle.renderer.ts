import type { RectangleBoardElement } from '../../board-elements/rectangle.board-element.js';
import { Vec2 } from '../../utils/vec2.utils.js';
import type { Camera } from '../../camera/camera.js';
import type { SharedRenderingContext } from '../shared-rendering-context.js';

export class RectangleRenderer {
	static render(ctx: SharedRenderingContext, element: RectangleBoardElement, camera: Camera) {
		const rect = element.getRectPoints();

		const a = camera.worldToScreen(Vec2.fromXY(rect.topLeft));
		const b = camera.worldToScreen(Vec2.fromXY(rect.topRight));
		const c = camera.worldToScreen(Vec2.fromXY(rect.bottomRight));
		const d = camera.worldToScreen(Vec2.fromXY(rect.bottomLeft));

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.lineTo(c.x, c.y);
		ctx.lineTo(d.x, d.y);
		ctx.closePath();

		const { size: worldSize, color } = element.getStrokeData();
		const size = worldSize * camera.getScale();

		ctx.lineWidth = size;
		ctx.strokeStyle = color;

		ctx.stroke();
		ctx.restore();
	}
}
