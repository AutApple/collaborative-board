import type { UpdateRoomDTOType } from '../../../../shared/room/dto/update-room.dto.js';
import type { Command } from '../../command-bus';
export interface UpdateRoomCommandPayload extends UpdateRoomDTOType {
	roomId: string;
}
export class UpdateRoomCommand implements Command<void> {
	constructor(public payload: UpdateRoomCommandPayload) {}
}
