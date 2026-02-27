import { ServerBoardEvents } from '../../../../shared/socket-events/socket-events.js';
import type { XY } from '../../../../shared/utils/vec2.utils.js';
import type { AppContext } from '../../app-context.js';
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

		const cursorMap = room.getCursorMap();
		const roomName = room.getName();
		const board = room.getBoard();

		client.setRoomId(roomId);

		const cursor = {
			clientId: client.getClientId(),
			worldCoords: cursorWorldCoords,
			local: false,
		};
		await this.roomService.registerClient(roomId, client.getClientId(), cursor);

		// cursorMap.addCursor(cursor);

		socket.emit(
			ServerBoardEvents.Handshake,
			roomId,
			roomName,
			board.getId()!,
			board.getElements().map((e) => e.toRaw()),
			cursorMap.foreignToList(),
			room.getConnectedClients(),
		);
		socket.to(roomId).emit(ServerBoardEvents.ClientConnected, client.getClientId(), cursor);

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
