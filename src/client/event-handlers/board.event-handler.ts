import { optimizeMutations, type BoardMutationList } from '../../../shared/board/board-mutation.js';
import { ServerBoardEvents } from '../../../shared/socket-events/board.socket-events.js';
import type { AppContext } from '../../app-context.js';
import type { ServiceContainer } from '../../common/instance-container.js';
import { RoomService } from '../../room/room.service.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class BoardEventHandler extends BaseEventHandler {
	private roomService: RoomService;
	constructor(serviceContainer: ServiceContainer) {
		super(serviceContainer);
		this.roomService = serviceContainer.getInstance(RoomService);
	}

	public onBoardMutations(client: Client, mutations: BoardMutationList) {
		const boardId = client.getBoardId();
		const socket = client.getSocket();

		if (!boardId) return;

		const room = this.roomService.get(boardId);

		if (!room) return;

		mutations = optimizeMutations(mutations);
		for (const mutation of mutations) {
			// console.log('Got mutation: ', mutation);
			// TODO: validate point array length, etc etc. only then apply mutations. reject on weird data
			room.board.applyMutation(mutation);
		}
		socket.to(boardId).emit(ServerBoardEvents.BoardMutations, mutations);
	}

	public onRequestRefresh(client: Client) {
		const socket = client.getSocket();
		const boardId = client.getBoardId();

		if (!boardId) return;
		const room = this.roomService.get(boardId);

		if (!room) return;

		socket.emit(
			ServerBoardEvents.RefreshBoard,
			room.board.getElements().map((element) => element.toRaw()),
		);
	}
}
