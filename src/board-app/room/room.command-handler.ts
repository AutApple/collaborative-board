import type { CommandBus } from '../../command-bus/command-bus.js';
import { UpdateRoomEditorsCommand } from '../../command-bus/commands/room/update-room-editors.command.js';
import { UpdateRoomCommand } from '../../command-bus/commands/room/update-room.command.js';
import type { ApplicationRoomService } from './room.service.js';

export class RoomCommandHandler {
	constructor(private roomService: ApplicationRoomService) {}

	private async updateRoomData(command: UpdateRoomCommand): Promise<void> {
		const { payload } = command;
		const { roomId, ...dto } = payload;
		this.roomService.update(roomId, dto);
	}

	private async updateRoomEditors(command: UpdateRoomEditorsCommand): Promise<void> {
		const { payload } = command;
		const { roomId } = payload;

		payload.addIds.map((editorId) => {
			this.roomService.addEditor(roomId, editorId);
		});
		payload.removeIds.map((editorId) => {
			this.roomService.removeEditor(roomId, editorId);
		});
	}

	public register(commandBus: CommandBus) {
		commandBus.register(UpdateRoomCommand.name, this.updateRoomData.bind(this));
		commandBus.register(UpdateRoomEditorsCommand.name, this.updateRoomEditors.bind(this));
	}
}
