import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../../shared/config/env.config.js';
import type { AccessTokenPayload } from '../interfaces/access-token-payload.interface.js';

export const safeValidateAndSetAccessToken = async (
	req: Request,
	res: Response<
		any,
		{ jwtPayload: AccessTokenPayload | undefined }
	>,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return next();

	const headerSegments = authHeader.split(' ');
	if (headerSegments.length !== 2 || headerSegments[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid credentials' });
	
	const accessToken = headerSegments[1];
	if (!accessToken) return next();

	const jwtPayload = jwt.verify(
		accessToken,
		env.JWT_ACCESS_SECRET,
	) as AccessTokenPayload;

	if (!jwtPayload) return next();

	res.locals.jwtPayload = jwtPayload;
	next();
};
