import type { Camera } from '../../camera/camera.js';

export abstract class BaseRenderLayer {
    constructor() {}
    
    public abstract updateData(...data: any): void;
    public abstract render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, camera: Camera): void;
}