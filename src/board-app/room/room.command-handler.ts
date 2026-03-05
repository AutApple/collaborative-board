import type { CommandBus } from '../../command-bus/command-bus.js';
import {
	UpdateRoomCommand,
	type UpdateRoomCommandPayload,
} from '../../command-bus/commands/room/update-room.command.js';
import type { ApplicationRoomService } from './room.service.js';

export class RoomCommandHandler {
	constructor(private roomService: ApplicationRoomService) {}

	private async updateRoomData(command: UpdateRoomCommand): Promise<void> {
		const { payload } = command;
		const { roomId, ...dto } = payload;
		this.roomService.update(roomId, dto); // TODO: SHARED ROOM UPDATE DTO TYPE AND ALL DTOS ARE SHARED
	}

	public register(commandBus: CommandBus) {
		commandBus.register(UpdateRoomCommand.name, this.updateRoomData.bind(this));
	}
}
