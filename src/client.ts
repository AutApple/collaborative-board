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

export class Client {
	private connected = true;
	private passedHandshake = false;

	private networkingEventHandler: NetworkingEventHandler;
	private boardEventHandler: BoardEventHandler;
	private cursorEventHandler: CursorEventHandler;

	private throttleMap: Map<(...args: any) => void, boolean> = new Map();

	private handshakeTimer: NodeJS.Timeout;

	private placeholderActionCounter = 0; // TODO: redefine save board behaviour, this exists for testing purposes only

	private boundHandlers = {
		onHandshake: (coords: XY) => {
			this.networkingEventHandler.onHandshake(coords);
		},
		onDisconnect: () => {
			this.networkingEventHandler.onDisconnect();
		},
		onLocalCursorMove: (pos: XY) => {
			this.callAndThrottle(
				serverConfiguraion.cursorMoveThrottlingTimeoutMs,
				this.cursorEventHandler.onLocalCursorMove,
				pos,
			);
		},
		onBoardMutations: async (mutations: BoardMutationList) => {
			this.callAndThrottle(
				serverConfiguraion.boardMutationsThrottlingTimeoutMs,
				this.boardEventHandler.onBoardMutations,
				mutations,
			);

			// TODO: redefine save board behaviour, following code is for testing purposes only!
			this.placeholderActionCounter += 1; 
			if (this.placeholderActionCounter === 5) {
				this.placeholderActionCounter = 0;
				const elements = this.appContext.board.getElements();
				
				const elementRepo = this.repositoryManager.getRepo(BoardElementRepository);
				if (!elementRepo) return;

				await Promise.all(elements.map(el => elementRepo.upsert(el)));
				
			}
		},
		onRequestRefresh: () => {
			this.callAndThrottle(
				serverConfiguraion.requestRefreshThrottlingTimeoutMs,
				this.boardEventHandler.onRequestRefresh,
			);
		},
	};

	constructor(
		private socket: BoardServerSocket,
		private appContext: AppContext,
		private clientRegistry: ClientRegistry,
		private repositoryManager: RepositoryManager
	) {
		socket.emit(
			ServerBoardEvents.Handshake,
			appContext.board.getElements().map((e) => e.toRaw()),
			appContext.cursorMap.toList(),
		);

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

	private callAndThrottle(timeout: number, callback: (...args: any) => void, ...args: any) {
		const canCall: boolean = this.throttleMap.get(callback) ?? true;
		if (canCall === false) return;

		callback.apply(this, args);
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

	public disconnect() {
		if (!this.connected) return;
		this.connected = false;

		this.clientRegistry.unregisterClient(this.socket.id);
		this.appContext.cursorMap.removeCursor(this.socket.id);

		this.socket.off(ClientBoardEvents.Handshake, this.boundHandlers.onHandshake);
		this.socket.off('disconnect', this.boundHandlers.onDisconnect);
		this.socket.off(ClientBoardEvents.LocalCursorMove, this.boundHandlers.onLocalCursorMove);
		this.socket.off(ClientBoardEvents.BoardMutations, this.boundHandlers.onBoardMutations);
		this.socket.off(ClientBoardEvents.RequestRefresh, this.boundHandlers.onRequestRefresh);

		this.socket.disconnect();
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
