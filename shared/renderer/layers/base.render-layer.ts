import type { Camera } from '../../camera/camera.js';
import type { SharedRenderingContext } from '../shared-rendering-context.js';

export abstract class BaseRenderLayer {
	constructor() {}

	public abstract updateData(...data: any): void;
	public abstract render(
		ctx: SharedRenderingContext,
		camera: Camera,
	): void;
}
