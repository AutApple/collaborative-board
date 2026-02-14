import type { OvalBoardElement } from '../../board-elements/oval.board-element.js';
import { Vec2 } from '../../utils/vec2.utils.js';
import type { Camera } from '../../camera/camera.js';
import type { SharedRenderingContext } from '../shared-rendering-context.js';

export class OvalRenderer {
	static render(
		ctx: SharedRenderingContext,
		element: OvalBoardElement,
		camera: Camera,
	) {
		// center + radii
		const c = camera.worldToScreen(Vec2.fromXY(element.getCenter()));
		const worldR = element.getRadius();
		const cameraScale = camera.getScale();
		const r = {
			x: worldR.x * cameraScale,
			y: worldR.y * cameraScale,
		};
		const { size: worldSize, color } = element.getStrokeData();
		const size = worldSize * camera.getScale();

		const halfStroke = size / 2;
		const safeRx = Math.max(0, r.x - halfStroke);
		const safeRy = Math.max(0, r.y - halfStroke);

		if (safeRx === 0 || safeRy === 0) return;

		ctx.save();

		ctx.beginPath();

		ctx.ellipse(c.x, c.y, r.x - size / 2, r.y - size / 2, 0, 0, Math.PI * 2);

		ctx.lineWidth = size;
		ctx.strokeStyle = color;
		ctx.stroke();

		ctx.restore();
	}
}
