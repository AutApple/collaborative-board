import type { BoardDebugStats } from '@shared/board/board.js';
import type { Camera } from '../../camera/camera.js';
import { BaseRenderLayer } from './base.render-layer.js';

export class DebugStatsRenderLayer extends BaseRenderLayer {
    private debugStats: BoardDebugStats = { overallElementsAmount: 0, overallPointsAmount: 0 };
    constructor() { super(); }
    public updateData(debugStats: BoardDebugStats): void {
        this.debugStats = debugStats;
    }
    public render(ctx: CanvasRenderingContext2D, _: Camera): void {
        ctx.fillStyle = 'black';
        ctx.fillText(`Overall elements: ${this.debugStats.overallElementsAmount}`, 16, 16);
        ctx.fillText(`Overall points: ${this.debugStats.overallPointsAmount}`, 16, 32);
    }

}