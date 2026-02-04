import type { OvalBoardElement } from '../../../../shared/board-elements/oval.board-element.js';
import type { Camera } from '../../camera/camera.js';

export class OvalRenderer {
	static render(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		element: OvalBoardElement,
		camera: Camera,
	) {
		const aWorld = element.position;
		const bWorld = element.getBottomRightPoint();

		// screen space
		const a = camera.worldToScreen(aWorld);
		const b = camera.worldToScreen(bWorld);

		// center + radii
		const cx = (a.x + b.x) / 2;
		const cy = (a.y + b.y) / 2;
		const rx = Math.abs(b.x - a.x) / 2;
		const ry = Math.abs(b.y - a.y) / 2;

		const { size, color } = element.getStrokeData();

		const halfStroke = size / 2;
		const safeRx = Math.max(0, rx - halfStroke);
		const safeRy = Math.max(0, ry - halfStroke);

		if (safeRx === 0 || safeRy === 0) return;

		ctx.save();

		ctx.beginPath();

		ctx.ellipse(cx, cy, rx - size / 2, ry - size / 2, 0, 0, Math.PI * 2);

		ctx.lineWidth = size;
		ctx.strokeStyle = color;
		ctx.stroke();

		ctx.restore();
	}
}
