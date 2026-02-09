import { optimizeMutations, type BoardMutationList } from '../../shared/board/board-mutation.js';
import { ServerBoardEvents } from '../../shared/socket-events/board.socket-events.js';
import type { AppContext } from '../app-context.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class BoardEventHandler extends BaseEventHandler {
	constructor(
		protected appContext: AppContext,
		protected client: Client,
	) {
		super(appContext, client);
	}

	public onBoardMutations(mutations: BoardMutationList) {
		const boardId = this.client.getBoardId()!;
		const room = this.appContext.roomRegistry.get(boardId);

		if (!room) return;

		mutations = optimizeMutations(mutations);
		for (const mutation of mutations) {
			// console.log('Got mutation: ', mutation);
			// TODO: validate point array length, etc etc. only then apply mutations. reject on weird data
			room.board.applyMutation(mutation);
		}
		this.socket.to(boardId).emit(ServerBoardEvents.BoardMutations, mutations);
	}

	public onRequestRefresh() {
		const boardId = this.client.getBoardId()!;
		const room = this.appContext.roomRegistry.get(boardId);

		if (!room) return;

		this.socket.emit(
			ServerBoardEvents.RefreshBoard,
			room.board.getElements().map((element) => element.toRaw()),
		);
	}
}
