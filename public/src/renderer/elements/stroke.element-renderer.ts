import type { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';
import type { Camera } from '../../camera/camera.js';

export class StrokeRenderer {
	static render(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		element: StrokeBoardElement,
		camera: Camera,
	) {
		const verts = element.getVertices();
		if (verts.length === 0) return;

		ctx.save();

		const scale = camera.getScale();
		const { color, size: worldSize } = element.getStrokeData();
		const size = worldSize * scale;

		ctx.lineWidth = size;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = color;

		// Single-point stroke = dot
		if (verts.length === 1) {
			const p = camera.worldToScreen(verts[0]!);
			ctx.beginPath();
			ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
			ctx.fillStyle = color;
			ctx.fill();
			return;
		}

		const start = camera.worldToScreen(verts[0]!);
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);

		for (let i = 1; i < verts.length; i++) {
			const prev = camera.worldToScreen(verts[i - 1]!);
			const curr = camera.worldToScreen(verts[i]!);

			// calculate midpoint between prev and curr
			const cx = (prev.x + curr.x) / 2;
			const cy = (prev.y + curr.y) / 2;

			ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
		}

		// connect to last point
		const last = camera.worldToScreen(verts[verts.length - 1]!);
		ctx.lineTo(last.x, last.y);
		ctx.stroke();
		ctx.restore();
	}
}
