import {
	optimizeMutations,
	type BoardMutationList,
} from '../../../../shared/board/board-mutation.js';
import { ServerBoardEvents } from '../../../../shared/socket-events/socket-events.js';
import type { ServiceContainer } from '../../common/instance-container.js';
import { ApplicationRoomService } from '../../room/room.service.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class BoardEventHandler extends BaseEventHandler {
	private roomService: ApplicationRoomService;
	constructor(serviceContainer: ServiceContainer) {
		super(serviceContainer);
		this.roomService = serviceContainer.getInstance(ApplicationRoomService);
	}

	public async onBoardMutations(client: Client, mutations: BoardMutationList) {
		const roomId = client.getRoomId();
		const socket = client.getSocket();
		if (!roomId) return;

		const room = await this.roomService.get(roomId);
		if (!room) return;

		const board = room.getBoard();

		mutations = optimizeMutations(mutations);
		for (const mutation of mutations) {
			// console.log('Got mutation: ', mutation);
			// TODO: validate point array length, etc etc. only then apply mutations. reject on weird data
			board.applyMutation(mutation);
		}
		socket.to(roomId).emit(ServerBoardEvents.BoardMutations, mutations);
	}

	public async onRequestRefresh(client: Client) {
		const socket = client.getSocket();
		const roomId = client.getRoomId();
		if (!roomId) return;

		const room = await this.roomService.get(roomId);
		if (!room) return;

		const board = room.getBoard();

		socket.emit(
			ServerBoardEvents.RefreshBoard,
			board.getElements().map((element) => element.toRaw()),
		);
	}
}
