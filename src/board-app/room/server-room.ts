import { ClientDataMap } from '../../../shared/client-data/client-data-map.js';
import type { ClientData } from '../../../shared/client-data/client-data.js';
import {
	BaseRoom,
	RoomStateType,
	type InitializedRoomState,
	type UninitializedRoomState,
} from '../../../shared/room/base-room.js';
import type { Board } from '../../../shared/board/board.js';

export interface ServerInitializationData {
	id: string;
	name: string;
	board: Board;
	clientData: ClientData[];
	ownerId: string | undefined;
	protectedMode: boolean;
	editorIds: string[];
}

export interface InitializedServerRoomState extends InitializedRoomState {
	ownerId: string;
	protectedMode: boolean;
	editorIds: string[];
}

export class ServerRoom extends BaseRoom {
	constructor() {
		super();
	}
	protected roomState: UninitializedRoomState | InitializedServerRoomState = {
		state: RoomStateType.Uninitialized,
	};

	private ensureInitializedServer(): asserts this is { roomState: InitializedServerRoomState } {
		if (this.roomState.state !== RoomStateType.Initialized) this.throwUnitializedError();
	}

	public initialize(data: ServerInitializationData) {
		const { id, name, board, ownerId, protectedMode, editorIds } = data;
		const clients = new ClientDataMap(...data.clientData);

		this.roomState = {
			state: RoomStateType.Initialized,
			id,
			name,
			board,
			ownerId: ownerId ?? '',
			protectedMode,
			editorIds,
			clients,
		};
	}

	public isProtected(): boolean {
		this.ensureInitializedServer();
		return this.roomState.protectedMode;
	}

	public getOwnerId(): string {
		this.ensureInitializedServer();
		return this.roomState.ownerId;
	}

	public setProtection(protectedMode: boolean): void {
		this.ensureInitializedServer();
		this.roomState.protectedMode = protectedMode;
	}

	public getEditorIds(): string[] {
		this.ensureInitializedServer();
		if (!this.roomState.protectedMode)
			throw new Error(
				'Unintended behaviour: Calling getEditors() when protected mode is not enabled on the room',
			);
		return [...this.roomState.editorIds];
	}
}
