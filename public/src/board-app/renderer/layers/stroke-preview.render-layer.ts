import type { StrokeData } from '../../../../../shared/board-elements/types/stroke-data.type.js';
import type { XY } from '../../../../../shared/utils/vec2.utils.js';
import type { Camera } from '../../camera/camera.js';
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
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		_: Camera,
	): void {
		const { x, y } = this.screenMouseCoords;
		const { color, size } = this.strokeData;

		ctx.beginPath();
		ctx.arc(x, y, size * 0.5, 0, Math.PI * 2); // multiply by hardcoded value to match circle radius with the stroke
		ctx.fillStyle = color;
		ctx.fill();
	}
}
