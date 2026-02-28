import { ServerBoardEvents } from '../../../../shared/socket-events/socket-events.js';
import { Vec2, type XY } from '../../../../shared/utils/vec2.utils.js';
import type { AppContext } from '../../app-context.js';
import type { ServiceContainer } from '../../common/instance-container.js';
import { RoomService } from '../../room/room.service.js';
import type { Client } from '../client.js';
import { BaseEventHandler } from './base.event-handler.js';

export class CursorEventHandler extends BaseEventHandler {
	private roomService: RoomService;
	constructor(serviceContainer: ServiceContainer) {
		super(serviceContainer);
		this.roomService = serviceContainer.getInstance(RoomService);
	}

	public async onLocalCursorMove(client: Client, pos: XY) {
		const roomId = client.getRoomId();
		const socket = client.getSocket();
		if (!roomId) return;

		const room = await this.roomService.get(roomId);
		if (!room) return;

		socket.to(roomId).emit(ServerBoardEvents.RemoteCursorMove, socket.id, pos);

		const clientDataMap = room.getClientDataMap();
		const clientData = clientDataMap.get(socket.id); 
		if (!clientData) {
			console.log('Critical issue: no client data for a client with given id');
			return;
		}
		clientData.cursor.position = Vec2.fromXY(pos);
	}
}
