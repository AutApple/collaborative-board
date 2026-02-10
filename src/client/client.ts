import {
	ClientBoardEvents,
	type BoardServerSocket,
} from '../../shared/socket-events/board.socket-events.js';
import { serverConfiguraion } from '../config/server.config.js';
import type { ClientRegistry } from './client-registry.js';
import type { ClientEventHandlers } from './client.event-handlers.js';

export class Client {
	private connected = true;

	private passedHandshake = false;
	private boardId: string | undefined;

	private handshakeTimer: NodeJS.Timeout | undefined;

	private clientEventHandlers: ClientEventHandlers | undefined;

	constructor(
		private socket: BoardServerSocket,
		private clientRegistry: ClientRegistry,
	) {}

	public bindHandlers(clientEventHandlers: ClientEventHandlers) {
		if (this.clientEventHandlers) throw new Error('Client handlers already bound');
		this.clientEventHandlers = clientEventHandlers;
		const boundHandlers = clientEventHandlers.getBoundHandlers();

		this.socket.on(ClientBoardEvents.Handshake, boundHandlers.onHandshake);
		this.socket.on('disconnect', boundHandlers.onDisconnect);
		this.socket.on(ClientBoardEvents.LocalCursorMove, boundHandlers.onLocalCursorMove);
		this.socket.on(ClientBoardEvents.BoardMutations, boundHandlers.onBoardMutations);
		this.socket.on(ClientBoardEvents.RequestRefresh, boundHandlers.onRequestRefresh);

		this.handshakeTimer = setTimeout(
			this._handshakePassCheck.bind(this),
			serverConfiguraion.handshakeTimeoutMs,
		);
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
		if (!this.connected || !this.clientEventHandlers) return;
		this.connected = false;

		this.clientRegistry.unregister(this.socket.id);

		const boundHandlers = this.clientEventHandlers.getBoundHandlers();
		this.socket.off(ClientBoardEvents.Handshake, boundHandlers.onHandshake);
		this.socket.off('disconnect', boundHandlers.onDisconnect);
		this.socket.off(ClientBoardEvents.LocalCursorMove, boundHandlers.onLocalCursorMove);
		this.socket.off(ClientBoardEvents.BoardMutations, boundHandlers.onBoardMutations);
		this.socket.off(ClientBoardEvents.RequestRefresh, boundHandlers.onRequestRefresh);

		this.socket.disconnect();

		// const room = this.appContext.roomRegistry.get(this.boardId!); // safely to assume that there is some boardId assigned on disconnect
		// if (!room) return;
		// room.cursorMap.removeCursor(this.socket.id);

		// await this.roomService.saveState(this.boardId!); // TODO: redefine save board behaviour somewhere else, do architecture cleaning
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
