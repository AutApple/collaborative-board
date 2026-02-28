import { ClientData } from '../../../../shared/client-data/client-data.js';
import { Cursor } from '../../../../shared/cursor/cursor.js';
import { ServerBoardEvents } from '../../../../shared/socket-events/socket-events.js';
import { Vec2, type XY } from '../../../../shared/utils/vec2.utils.js';
import type { ServiceContainer } from '../../common/instance-container.js';
import { RoomService } from '../../room/room.service.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class NetworkingEventHandler extends BaseEventHandler {
	private roomService: RoomService;
	constructor(serviceContainer: ServiceContainer) {
		super(serviceContainer);
		this.roomService = serviceContainer.getInstance(RoomService);
	}

	public async onHandshake(client: Client, roomId: string, cursorWorldCoords: XY) {
		if (client.didPassHandshake() === true) return;

		const socket = client.getSocket();

		const room = await this.roomService.get(roomId);

		if (room === undefined) {
			socket.emit(ServerBoardEvents.BoardNotFound);
			client.disconnect();
			return;
		}

		const clients = room.getForeignClientDataList();
		const roomName = room.getName();
		const board = room.getBoard();

		client.setRoomId(roomId);

		const clientData = new ClientData(
			client.getClientId(),
			false,
			new Cursor(Vec2.fromXY(cursorWorldCoords))
		);
		await this.roomService.registerClient(roomId, clientData);

		socket.emit(
			ServerBoardEvents.Handshake,
			roomId,
			roomName,
			board.getId()!,
			board.getElements().map((e) => e.toRaw()),
			clients
		);
		
		socket.to(roomId).emit(ServerBoardEvents.ClientConnected, clientData);

		client.markHandshakePass();
	}

	public async onDisconnect(client: Client) {
		const roomId = client.getRoomId();
		if (!roomId) return;

		// await this.roomService.saveState(roomId);

		const clientId = client.getClientId();
		await this.roomService.unregisterClient(roomId, clientId);

		// const room = (await this.roomService.get(roomId))!;
		// const cursorMap = room.getCursorMap();
		// cursorMap.removeCursor(clientId);

		const socket = client.getSocket();
		socket.to(roomId).emit(ServerBoardEvents.ClientDisconnected, clientId);

		client.disconnect();
	}
}
