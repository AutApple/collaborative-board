import type { BaseBoardElement } from '../../../../shared/board-elements/base/base.board-element.js';
import type { OvalBoardElement } from '../../../../shared/board-elements/oval.board-element.js';
import type { RectangleBoardElement } from '../../../../shared/board-elements/rectangle.board-element.js';
import { StrokeBoardElement } from '../../../../shared/board-elements/stroke.board-element.js';
import { BoardElementType } from '../../../../shared/board-elements/types/board-element-type.js';
import { Vec2 } from '../../../../shared/utils/vec2.utils.js';
import type { Camera } from '../../camera/camera.js';
import { OvalRenderer } from '../elements/oval.renderer.js';
import { RectangleRenderer } from '../elements/rectangle.renderer.js';
import { StrokeRenderer } from '../elements/stroke.element-renderer.js';
import { BaseRenderLayer } from './base.render-layer.js';

export class BoardElementsRenderLayer extends BaseRenderLayer {
	private elements: BaseBoardElement[] = [];
	constructor() {
		super();
	}
	
	private renderElement(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		element: BaseBoardElement,
		camera: Camera,
	) {
		switch (element.type) {
			case BoardElementType.Stroke:
				StrokeRenderer.render(ctx, element as StrokeBoardElement, camera);
				break;
			case BoardElementType.Oval:
				OvalRenderer.render(ctx, element as OvalBoardElement, camera);
				break;
			case BoardElementType.Rectangle:
				RectangleRenderer.render(ctx, element as RectangleBoardElement, camera);
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
