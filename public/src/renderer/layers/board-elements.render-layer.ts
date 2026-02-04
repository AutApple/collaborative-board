import type { BaseBoardElement } from '../../../../shared/board-elements/base/base.board-element.js';
import type { OvalBoardElement } from '../../../../shared/board-elements/oval.board-element.js';
import type { RectangleBoardElement } from '../../../../shared/board-elements/rectangle.board-element.js';
import type { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';
import { BoardElementType } from '../../../../shared/board-elements/types/board-element-type.js';
import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import type { Camera } from '../../camera/camera.js';
import { BaseRenderLayer } from './base.render-layer.js';

export class BoardElementsRenderLayer extends BaseRenderLayer {
	private elements: BaseBoardElement[] = [];
	constructor() {
		super();
	}

	private normalizeWorldRect(a: Vec2, b: Vec2) {
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

	private renderStroke(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		element: StrokeBoardElement,
		camera: Camera,
	) {
		const verts = element.getVertices();
		if (verts.length === 0) return;

		ctx.save();

		const { color, size } = element.getStrokeData();
		ctx.lineWidth = size;
		ctx.lineCap = 'round';
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

	private renderRectangle(
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

	private renderOval(
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

	private renderElement(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		element: BaseBoardElement,
		camera: Camera,
	) {
		switch (element.type) {
			case BoardElementType.Stroke:
				this.renderStroke(ctx, element as StrokeBoardElement, camera);
				break;
			case BoardElementType.Oval:
				this.renderOval(ctx, element as OvalBoardElement, camera);
				break;
			case BoardElementType.Rectangle:
				this.renderRectangle(ctx, element as RectangleBoardElement, camera);
				break;
		}
	}

	public override updateData(elements: BaseBoardElement[]): void {
		this.elements = elements;
	}

	public override render(ctx: CanvasRenderingContext2D, camera: Camera): void {
		for (const element of this.elements) this.renderElement(ctx, element, camera);
	}
}
