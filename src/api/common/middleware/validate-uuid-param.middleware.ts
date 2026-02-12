import type { NextFunction, Request, Response } from 'express';
import { validate as isUUID } from 'uuid';

// TODO: make it zod-schema based like validate dto
export function validateUUIDParam(req: Request, res: Response, next: NextFunction) {
	const param = req.params['param'];
	if (!param) return res.status(400).json({ message: 'No param specified' });
	if (!isUUID(param)) return res.status(400).json({ message: 'Param should be uuid' });
	next();
}
