import type { OvalBoardElement } from '../../../../shared/board-elements/oval.board-element.js';
import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import type { Camera } from '../../camera/camera.js';

export class OvalRenderer {
	static render(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		element: OvalBoardElement,
		camera: Camera,
	) {
		const aWorld = element.position;
		const bWorld = element.getSecondPoint();

		// screen space
		const a = camera.worldToScreen(aWorld);
		const b = camera.worldToScreen(bWorld);

		// center + radii
		const c = camera.worldToScreen(Vec2.fromXY(element.getCenter()));
		const r = element.getRadius();

		const { size, color } = element.getStrokeData();

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
