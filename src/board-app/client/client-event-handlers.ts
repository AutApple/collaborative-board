import { Client } from './client.js';
import type { BoardMutationList } from '../../../shared/board/board-mutation.js';
import type { XY } from '../../../shared/utils/vec2.utils.js';
import type { AppContext } from '../app-context.js';
import { serverConfiguraion } from '../../config/server.config.js';
import type { ApplicationRoomService } from '../room/room.service.js';
import type { BaseEventHandler } from './event-handlers/base.event-handler.js';
import { BoardEventHandler } from './event-handlers/board.event-handler.js';
import { CursorEventHandler } from './event-handlers/cursor.event-handler.js';
import { NetworkingEventHandler } from './event-handlers/networking.event-handler.js';
import type { ServiceContainer } from '../common/instance-container.js';

export class ClientEventHandlers {
	private networkingEventHandler: NetworkingEventHandler;
	private boardEventHandler: BoardEventHandler;
	private cursorEventHandler: CursorEventHandler;

	constructor(
		private client: Client,
		serviceContainer: ServiceContainer,
	) {
		this.networkingEventHandler = new NetworkingEventHandler(serviceContainer);
		this.boardEventHandler = new BoardEventHandler(serviceContainer);
		this.cursorEventHandler = new CursorEventHandler(serviceContainer);
	}

	private throttleMap: Map<(...args: any) => void, boolean> = new Map();
	private readonly boundHandlers = {
		onHandshake: (boardId: string, coords: XY) => {
			this.networkingEventHandler.onHandshake(this.client, boardId, coords);
		},
		onDisconnect: () => {
			this.networkingEventHandler.onDisconnect(this.client);
		},
		onLocalCursorMove: (pos: XY) => {
			this.callAndThrottle(
				serverConfiguraion.cursorMoveThrottlingTimeoutMs,
				this.cursorEventHandler.onLocalCursorMove,
				this.cursorEventHandler,
				this.client,
				pos,
			);
		},
		onBoardMutations: (mutations: BoardMutationList) => {
			this.callAndThrottle(
				serverConfiguraion.boardMutationsThrottlingTimeoutMs,
				this.boardEventHandler.onBoardMutations,
				this.boardEventHandler,
				this.client,
				mutations,
			);
		},
		onRequestRefresh: () => {
			this.callAndThrottle(
				serverConfiguraion.requestRefreshThrottlingTimeoutMs,
				this.boardEventHandler.onRequestRefresh,
				this.boardEventHandler,
				this.client,
			);
		},
	};

	public getBoundHandlers() {
		return this.boundHandlers;
	}

	private callAndThrottle(
		timeout: number,
		callback: (...args: any) => void,
		handler: BaseEventHandler,
		...args: any
	) {
		const canCall: boolean = this.throttleMap.get(callback) ?? true;
		if (canCall === false) return;

		callback.apply(handler, args);
		this.throttleMap.set(callback, false);
		setTimeout(() => {
			this.throttleMap.set(callback, true);
		}, timeout);
	}
}
