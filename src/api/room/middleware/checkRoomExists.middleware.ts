import type { Request, Response, NextFunction } from 'express';
import type { APIRoomService } from '../room.service.js';

export const checkRoomExists = (roomService: APIRoomService) => {
	return async (req: Request<{ param: string }>, res: Response, next: NextFunction) => {
		const { param: id } = req.params;
		const room = await roomService.get(id);

		if (!room)
			return res.status(404).json({ message: 'Room not found' });
		

		res.locals.room = room; // passing board to the controller
		next();
	};
};
