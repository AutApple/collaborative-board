import type { Command } from '../../command-bus';
export interface UpdateRoomEditorsCommandPayload {
	roomId: string;
	addIds: string[];
	removeIds: string[];
}
export class UpdateRoomEditorsCommand implements Command<void> {
	constructor(public payload: UpdateRoomEditorsCommandPayload) {}
}
