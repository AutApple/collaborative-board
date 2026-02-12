import type { Request, Response, NextFunction } from 'express';
import type { APIBoardService } from '../board.service.js';

export const checkBoardExists = (boardService: APIBoardService) => {
	return async (req: Request<{ param: string }>, res: Response, next: NextFunction) => {
		const { param: id } = req.params;
		const board = await boardService.get(id);

		if (!board) {
			return res.status(404).json({ message: 'Board not found' });
		}

		res.locals.board = board; // passing board to the controller
		next();
	};
};
