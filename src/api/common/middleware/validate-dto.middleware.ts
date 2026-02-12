import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const validateDTO =
	(schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);
		if (!result.success) {
			const formattedErrors = result.error.issues.map((e) => ({
				field: e.path.join('.'),
				message: e.message,
			}));
			return res.status(400).json({ errors: formattedErrors });
		}

		res.locals.dto = result.data;
		next();
	};
