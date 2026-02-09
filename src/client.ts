import { type BoardMutationList } from '../shared/board/board-mutation.js';
import {
	ClientBoardEvents,
	ServerBoardEvents,
	type BoardServerSocket,
} from '../shared/socket-events/board.socket-events.js';
import type { XY } from '../shared/utils/vec2.utils.js';
import type { AppContext } from './app-context.js';
import { BoardElementRepository } from './repos/board-element.repository.js';
import type { ClientRegistry } from './client-registry.js';
import { serverConfiguraion } from './config/server.config.js';
import { BoardEventHandler } from './event-handlers/board.event-handler.js';
import { CursorEventHandler } from './event-handlers/cursor.event-handler.js';
import { NetworkingEventHandler } from './event-handlers/networking.event-handler.js';
import type { RepositoryManager } from './repos/repository-manager.js';
import type { BaseEventHandler } from './event-handlers/base.event-handler.js';

export class Client {
	private connected = true;

	private passedHandshake = false;
	private boardId: string | undefined;

	private networkingEventHandler: NetworkingEventHandler;
	private boardEventHandler: BoardEventHandler;
	private cursorEventHandler: CursorEventHandler;

	private throttleMap: Map<(...args: any) => void, boolean> = new Map();

	private handshakeTimer: NodeJS.Timeout;

	private boundHandlers = {
		onHandshake: (boardId: string, coords: XY) => {
			this.networkingEventHandler.onHandshake(boardId, coords);
		},
		onDisconnect: () => {
			this.networkingEventHandler.onDisconnect();
		},
		onLocalCursorMove: (pos: XY) => {
			this.callAndThrottle(
				serverConfiguraion.cursorMoveThrottlingTimeoutMs,
				this.cursorEventHandler.onLocalCursorMove,
				this.cursorEventHandler,
				pos,
			);
		},
		onBoardMutations: (mutations: BoardMutationList) => {
			this.callAndThrottle(
				serverConfiguraion.boardMutationsThrottlingTimeoutMs,
				this.boardEventHandler.onBoardMutations,
				this.boardEventHandler,
				mutations,
			);
		},
		onRequestRefresh: () => {
			this.callAndThrottle(
				serverConfiguraion.requestRefreshThrottlingTimeoutMs,
				this.boardEventHandler.onRequestRefresh,
				this.boardEventHandler,
			);
		},
	};

	constructor(
		private socket: BoardServerSocket,
		private appContext: AppContext,
		private clientRegistry: ClientRegistry,
		private repositoryManager: RepositoryManager,
	) {
		this.networkingEventHandler = new NetworkingEventHandler(appContext, this);
		this.boardEventHandler = new BoardEventHandler(appContext, this);
		this.cursorEventHandler = new CursorEventHandler(appContext, this);

		this.handshakeTimer = setTimeout(
			this._handshakePassCheck.bind(this),
			serverConfiguraion.handshakeTimeoutMs,
		);

		socket.on(ClientBoardEvents.Handshake, this.boundHandlers.onHandshake);
		socket.on('disconnect', this.boundHandlers.onDisconnect);
		socket.on(ClientBoardEvents.LocalCursorMove, this.boundHandlers.onLocalCursorMove);
		socket.on(ClientBoardEvents.BoardMutations, this.boundHandlers.onBoardMutations);
		socket.on(ClientBoardEvents.RequestRefresh, this.boundHandlers.onRequestRefresh);
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

	public getClientId() {
		return this.socket.id;
	}

	public getSocket(): BoardServerSocket {
		return this.socket;
	}

	public setBoardId(id: string) {
		this.boardId = id;
		this.socket.join(this.boardId);

		console.log(`Socket with id ${this.socket.id} joined ${this.boardId}`);
	}

	public getBoardId() {
		return this.boardId;
	}

	public async disconnect() {
		if (!this.connected) return;
		this.connected = false;

		this.clientRegistry.unregister(this.socket.id);

		this.socket.off(ClientBoardEvents.Handshake, this.boundHandlers.onHandshake);
		this.socket.off('disconnect', this.boundHandlers.onDisconnect);
		this.socket.off(ClientBoardEvents.LocalCursorMove, this.boundHandlers.onLocalCursorMove);
		this.socket.off(ClientBoardEvents.BoardMutations, this.boundHandlers.onBoardMutations);
		this.socket.off(ClientBoardEvents.RequestRefresh, this.boundHandlers.onRequestRefresh);

		this.socket.disconnect();

		const room = this.appContext.roomRegistry.get(this.boardId!); // safely to assume that there is some boardId assigned on disconnect
		if (!room) return;
		room.cursorMap.removeCursor(this.socket.id);

		// TODO: redefine save board behaviour in BoardRepository, following code is for testing purposes only!
		// const elements = room.board.getElements();

		// const elementRepo = this.repositoryManager.getRepo(BoardElementRepository);
		// if (!elementRepo) return;

		// await Promise.all(elements.map((el) => elementRepo.save(el)));
	}

	public didPassHandshake(): boolean {
		return this.passedHandshake;
	}

	public markHandshakePass() {
		this.passedHandshake = true;
		clearTimeout(this.handshakeTimer);
	}

	private _handshakePassCheck() {
		if (!this.passedHandshake) this.disconnect(); // Disconnect socket if it didn't do handshake
	}
}
