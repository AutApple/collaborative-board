import type { Board } from '../../../shared/board/board.js';
import { ClientDataMap } from '../../../shared/client-data/client-data-map.js';
import { ClientData } from '../../../shared/client-data/client-data.js';
import { Cursor } from '../../../shared/cursor/cursor.js';
import {
	BaseRoom,
	RoomStateType,
	type InitializedRoomState,
} from '../../../shared/room/base-room.js';
import { Vec2 } from '../../../shared/utils/vec2.utils.js';

export interface ClientInitializationData {
	id: string;
	name: string;
	board: Board;
	clientData: ClientData[];
}

export class ClientRoom extends BaseRoom {
	protected localClientData: ClientData = new ClientData('0', true, new Cursor(new Vec2(0, 0)));
	constructor() {
		super();
	}

	public initialize(data: ClientInitializationData) {
		const { id, name, board } = data;
		const clients = new ClientDataMap(...data.clientData);

		this.roomState = {
			state: RoomStateType.Initialized,
			id,
			name,
			board,
			clients,
		};
	}

	public getLocalClientData(): ClientData {
		return this.localClientData;
	}
}
