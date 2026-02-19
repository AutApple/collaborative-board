import type { Camera } from '@shared/camera/camera.js';
import { BaseRenderLayer } from '@shared/renderer/layers/base.render-layer.js';
import type { SharedRenderingContext } from '@shared/renderer/shared-rendering-context.js';
import type { RoomDebugStats } from '@shared/room/room.js';

export class DebugStatsRenderLayer extends BaseRenderLayer {
	private debugStats: RoomDebugStats = {
		roomId: 'Undefined',
		roomName: 'Undefined',
		boardDebugStats: {
			boardId: 'Undefined',
			overallElementsAmount: 0,
			overallPointsAmount: 0
		}
	};

	constructor() {
		super();
	}
	public updateData(debugStats: RoomDebugStats): void {
		this.debugStats = debugStats;
	}
	public render(
		ctx: SharedRenderingContext,
		_: Camera,
	): void {
		ctx.save();
		ctx.fillStyle = 'black';
		ctx.fillText(`Overall elements: ${this.debugStats.boardDebugStats.overallElementsAmount}`, 16, 16);
		ctx.fillText(`Overall points: ${this.debugStats.boardDebugStats.overallPointsAmount}`, 16, 32);
		ctx.fillText(`Board ID: ${this.debugStats.boardDebugStats.boardId}`, 16, 48);
		ctx.fillText(`Room ID: ${this.debugStats.roomId}`, 16, 64);
		ctx.fillText(`Room Name: ${this.debugStats.roomName}`, 16, 80);
		ctx.restore();
	}
}
