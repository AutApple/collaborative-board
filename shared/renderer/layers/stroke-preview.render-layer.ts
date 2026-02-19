import type { StrokeData } from '../../board-elements/types/stroke-data.type.js';
import type { XY } from '../../utils/vec2.utils.js';
import type { Camera } from '../../camera/camera.js';
import type { SharedRenderingContext } from '../shared-rendering-context.js';
import { BaseRenderLayer } from './base.render-layer.js';

export class StrokePreviewRenderLayer extends BaseRenderLayer {
	private strokeData: StrokeData = { color: 'black', size: 6 };
	private screenMouseCoords: XY = { x: 0, y: 0 };
	constructor() {
		super();
	}

	public override updateData(strokeData: StrokeData, screenMouseCoords: XY): void {
		this.strokeData = strokeData;
		this.screenMouseCoords = screenMouseCoords;
	}
	public override render(
		ctx: SharedRenderingContext,
		camera: Camera,
	): void {
		const { x, y } = this.screenMouseCoords;
		const { color, size } = this.strokeData;

		ctx.beginPath();
		ctx.arc(x, y, size * 0.5 * camera.getScale(), 0, Math.PI * 2); // multiply by hardcoded value to match circle radius with the stroke
		ctx.fillStyle = color;
		ctx.fill();
	}
}
