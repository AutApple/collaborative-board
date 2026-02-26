import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import type { AnyResponseLocals } from '../types/any-response-locals.type.js';

export interface DtoResponseLocals<T> {
	dto: T;
}

export const validateDTO =
	<T>(schema: ZodType) =>
	(req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			const formattedErrors = result.error.issues.map((e) => ({
				field: e.path.join('.'),
				message: e.message,
			}));
			return res.status(400).json({ errors: formattedErrors });
		}

		(res.locals as DtoResponseLocals<T> & AnyResponseLocals).dto = result.data as T;
		next();
	};
