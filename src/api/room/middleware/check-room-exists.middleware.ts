import type { Request, Response, NextFunction } from 'express';
import type { APIRoomService } from '../room.service.js';
import type { Room } from '../../../board-app/generated/prisma/client.js';
import type { AnyResponseLocals } from '../../common/types/any-response-locals.type.js';
export interface RoomResponseLocals {
	room: Room
} 

export const checkRoomExists = (roomService: APIRoomService) => {
	return async (req: Request<{ param: string }>, res: Response, next: NextFunction) => {
		const { param: id } = req.params;
		const room = await roomService.get(id);

		if (!room) return res.status(404).json({ message: 'Room not found' });

		(res.locals as RoomResponseLocals & AnyResponseLocals).room = room; // passing board to the controller
		next();
	};
};
