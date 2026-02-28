import type { CommandBus } from '../../command-bus/command-bus.js';
import {
	UpdateRoomCommand,
	type UpdateRoomCommandPayload,
} from '../../command-bus/commands/room/update-room.command.js';
import type { RoomService } from './room.service.js';

export class RoomCommandHandler {
	constructor(private roomService: RoomService) {}

	private async updateRoomData(command: UpdateRoomCommand): Promise<void> {
		const { payload } = command;
		console.log(payload);

		if (!payload.name) return;
		this.roomService.update(payload.roomId, payload.name);
	}

	public register(commandBus: CommandBus) {
		commandBus.register(UpdateRoomCommand.name, this.updateRoomData.bind(this));
	}
}
