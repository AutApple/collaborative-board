import type { Board, BoardDebugStats } from '../board/board.js';
import { ClientDataMap } from '../client-data/client-data-map.js';
import { ClientData } from '../client-data/client-data.js';
import { Cursor } from '../cursor/cursor.js';
import { Vec2 } from '../utils/vec2.utils.js';

export interface RoomDebugStats {
	roomId: string;
	roomName: string;

	boardDebugStats: BoardDebugStats;
}

export interface RoomOptions {
	isLocal: boolean;
}

const defaultRoomOptions: RoomOptions = {
	isLocal: false
};

export class Room {
	private initFlag: boolean = false;

	private id: string | undefined;
	private name: string | undefined;
	private board: Board | undefined;

	private clients: ClientDataMap | undefined;
	private localClientData: ClientData | undefined;

	constructor(private options: RoomOptions = defaultRoomOptions) {
		if (this.options.isLocal) this.localClientData = new ClientData('0', true, new Cursor(new Vec2(0, 0)));
	}

	public initialize(id: string, name: string, board: Board, clientData: ClientData[]) {
		this.id = id;
		this.name = name;
		this.board = board;
		this.initFlag = true;
		this.clients = new ClientDataMap(... clientData);
	}

	public registerClient(clientData: ClientData) {
		if (!this.clients) throw new Error("Can't register client in uninitialzied room");
		this.clients.addClientData(clientData);
	}
	public unregisterClient(clientId: string) {
		if (!this.clients) throw new Error("Can't unregister client in uninitialized room");
		this.clients.removeClientData(clientId);
	}
	
	public getClientsAmount(): number {
		if (!this.clients) throw new Error("Can't unregister client in uninitialized room");
		return this.clients.getClientAmount();
	}

	public isInitialized(): boolean {
		return this.initFlag;
	}

	public setName(name: string): void {
		this.name = name;
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

	public getForeignClientDataList(): ClientData[] {
		if (!this.clients) throw new Error("Can't unregister client in uninitialized room");
		return this.clients.foreignDataToList();
	}

	public getClientDataMap() {
		if (!this.clients) throw new Error("Can't unregister client in uninitialized room");
		return this.clients;		
	}
	
	public getLocalClientData(): ClientData {
		if (!this.localClientData) throw new Error('Can\'t get local client in non-local room instance');
		return this.localClientData;
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
