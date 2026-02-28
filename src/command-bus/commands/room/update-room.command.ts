import type { Command } from '../../command-bus';
export interface UpdateRoomCommandPayload {
	// TODO: define some kind of shared dtos for rooms or something
	roomId: string;
	name: string | undefined;
	isPublic: boolean | undefined;
}
export class UpdateRoomCommand implements Command<void> {
	constructor(public payload: UpdateRoomCommandPayload) {}
}
