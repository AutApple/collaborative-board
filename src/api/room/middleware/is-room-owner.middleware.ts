import type { Request, Response, NextFunction } from 'express';
import type { APIRoomService } from '../room.service.js';
import type { Room } from '../../../board-app/generated/prisma/client.js';
import type { AnyResponseLocals } from '../../common/types/any-response-locals.type.js';
import type { AccessTokenResponseLocals } from '../../auth/middleware/validate-and-set-access-token.middleware.js';

export interface RoomResponseLocals {
	room: Room;
}

export const isRoomOwner = (roomService: APIRoomService) => {
	return async (req: Request<{ param: string }>, res: Response, next: NextFunction) => {
		if (!res.locals.jwtPayload?.userId)
			throw new Error('isRoomOwner middleware should go after access token validation middleware');

		const { param: id } = req.params;
		const room = await roomService.get(id);

		if (!room) return res.status(404).json({ message: 'Room not found' });

		if (room.authorId !== res.locals.jwtPayload.userId)
			return res.status(403).json({ message: 'Forbidden' });

		(res.locals as RoomResponseLocals & AnyResponseLocals & AccessTokenResponseLocals).room = room; // passing board to the controller
		next();
	};
};
