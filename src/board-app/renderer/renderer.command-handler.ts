import type { CommandBus } from '../../command-bus/command-bus.js';
import { RenderBlankCommand } from '../../command-bus/commands/renderer/render-blank.command.js';
import { RenderBoardCommand } from '../../command-bus/commands/renderer/render-board.command.js';
import type { ApplicationRoomService } from '../room/room.service.js';
import type { ApplicationServerRendererService } from './renderer.service.js';

export class RendererCommandHandler {
	constructor(
		private rendererService: ApplicationServerRendererService,
		private roomService: ApplicationRoomService,
	) {}

	private async renderRoomBoard(command: RenderBoardCommand): Promise<Uint8Array<ArrayBuffer>> {
		const room = await this.roomService.get(command.roomId);
		if (!room) throw new Error("Can't render room board: unknown room id");
		const board = room.getBoard();

		const result = this.rendererService.renderBoardToBytes(board);
		return result;
	}

	private async renderBlank(): Promise<Uint8Array<ArrayBuffer>> {
		return this.rendererService.renderBlankToBytes();
	}

	public register(commandBus: CommandBus) {
		commandBus.register(RenderBoardCommand.name, this.renderRoomBoard.bind(this));
		commandBus.register(RenderBlankCommand.name, this.renderBlank.bind(this));
	}
}
