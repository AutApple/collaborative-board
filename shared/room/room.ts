import type { Board, BoardDebugStats } from '../board/board.js';
import { RemoteCursorMap } from '../remote-cursor/remote-cursor-map.js';
import type { Cursor } from '../remote-cursor/types/cursor.js';
import type { Vec2 } from '../utils/vec2.utils.js';

export interface RoomDebugStats {
	roomId: string;
	roomName: string;

	boardDebugStats: BoardDebugStats;
}

export class Room {
	private initFlag: boolean = false;

	private id: string | undefined;
	private name: string | undefined;
	private board: Board | undefined;
	private connectedClients: string [] | undefined;
	private remoteCursorMap: RemoteCursorMap = new RemoteCursorMap();


	constructor(private local: boolean = false) {
		if (this.local) this.remoteCursorMap.addLocal();
	}

	public initialize(id: string, name: string, board: Board, connectedClients: string[]) {
		this.id = id;
		this.name = name;
		this.board = board;
		this.initFlag = true;
		this.connectedClients = connectedClients;
	}
	
	public registerClient(clientId: string, cursor: Cursor) {
		if (!this.connectedClients) throw new Error('Can\'t register client in uninitialzied room');
		this.connectedClients.push(clientId);
		this.remoteCursorMap.addCursor(cursor);
	}
	public unregisterClient(clientId: string) {
		if (!this.connectedClients) throw new Error('Can\'t unregister client in uninitialized room');
		this.connectedClients = this.connectedClients.filter(v => v !== clientId);
		this.remoteCursorMap.removeCursor(clientId);
	}
	public getClientsAmount(): number {
		if (!this.connectedClients) throw new Error('Can\'t get clients amount in uninitialized room');		
		return this.connectedClients.length;
	}
	public getConnectedClients(): string[] {
		if (!this.connectedClients) throw new Error('Can\'t get clients in uninitialized room');		
		return this.connectedClients;
	}

	public isInitialized(): boolean {
		return this.initFlag;
	}

	public getName(): string {
		if (!this.initFlag) throw new Error('Calling get name on unitialized room');
		return this.name!;
	}

	public getId(): string {
		if (!this.initFlag) throw new Error('Calling get id on unitialized room');
		return this.id!;
	}

	public getBoard(): Board {
		if (!this.initFlag) throw new Error('Calling get board on unitialized room');
		return this.board!;
	}

	public getLocalCursor(): Cursor {
		const cursor = this.remoteCursorMap.getLocal();
		if (!cursor) throw new Error('Trying to retrieve local cursor from non-local room');
		return cursor;
	}
	public getCursorMap(): RemoteCursorMap {
		return this.remoteCursorMap;
	}
	public getForeignCursorList(): Cursor[] {
		return this.remoteCursorMap.foreignToList();
	}

	public getDebugStats(): RoomDebugStats {
		return {
			roomId: this.id ?? 'Unitialized',
			roomName: this.name ?? 'Unitialized',
			boardDebugStats: this.board?.getDebugStats() ?? {
				boardId: 'Unitialized',
				overallElementsAmount: -1,
				overallPointsAmount: -1,
			},
		};
	}
}
