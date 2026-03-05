import type { Board, BoardDebugStats } from '../board/board.js';
import { ClientDataMap } from '../client-data/client-data-map.js';
import { ClientData } from '../client-data/client-data.js';

export interface RoomDebugStats {
	roomId: string;
	roomName: string;

	boardDebugStats: BoardDebugStats;
}

export enum RoomStateType {
	Uninitialized,
	Initialized,
}

export interface BaseRoomState {
	state: RoomStateType;
}

export interface UninitializedRoomState extends BaseRoomState {
	state: RoomStateType.Uninitialized;
}
export interface InitializedRoomState extends BaseRoomState {
	state: RoomStateType.Initialized;

	id: string;
	name: string;
	board: Board;
	clients: ClientDataMap;
}

export class BaseRoom {
	protected roomState: UninitializedRoomState | InitializedRoomState = {
		state: RoomStateType.Uninitialized,
	};

	constructor() {}

	protected throwUnitializedError() {
		throw new Error("Can't call this method when the room is not initialized");
	}

	// helper method to assert that the room is initialized
	private ensureInitialized(): asserts this is { roomState: InitializedRoomState } {
		if (this.roomState.state !== RoomStateType.Initialized) this.throwUnitializedError();
	}

	public registerClient(clientData: ClientData) {
		this.ensureInitialized();
		this.roomState.clients.addClientData(clientData);
	}
	public unregisterClient(clientId: string) {
		this.ensureInitialized();
		this.roomState.clients.removeClientData(clientId);
	}

	public getClientsAmount(): number {
		this.ensureInitialized();
		return this.roomState.clients.getClientAmount();
	}

	public isInitialized(): boolean {
		return this.roomState.state === RoomStateType.Initialized;
	}

	public setName(name: string): void {
		this.ensureInitialized();
		this.roomState.name = name;
	}

	public getName(): string {
		this.ensureInitialized();
		return this.roomState.name;
	}

	public getId(): string {
		this.ensureInitialized();
		return this.roomState.id;
	}

	public getBoard(): Board {
		this.ensureInitialized();
		return this.roomState.board;
	}

	public getClientDataMap(): ClientDataMap {
		this.ensureInitialized();
		return this.roomState.clients;
	}

	public getDebugStats(): RoomDebugStats {
		return {
			roomId: (this.roomState as InitializedRoomState).id ?? 'Uninitialized',
			roomName: (this.roomState as InitializedRoomState).name ?? 'Uninitialized',
			boardDebugStats: (this.roomState as InitializedRoomState).board?.getDebugStats() ?? {
				boardId: 'Uninitialized',
				overallElementsAmount: -1,
				overallPointsAmount: -1,
			},
		};
	}
}
