import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../../shared/config/env.config.js';
import type { AccessTokenPayload } from '../interfaces/access-token-payload.interface.js';
import type { AnyResponseLocals } from '../../common/types/any-response-locals.type.js';

export interface AccessTokenResponseLocals {
	jwtPayload: AccessTokenPayload; 
}


export const validateAndSetAccessToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ message: 'Invalid credentials' });

	const headerSegments = authHeader.split(' ');
	if (headerSegments.length !== 2 || headerSegments[0] !== 'Bearer')
		return res.status(401).json({ message: 'Invalid credentials' });

	const accessToken = headerSegments[1];
	if (!accessToken) return res.status(401).json({ message: 'Invalid credentials' });

	let jwtPayload = undefined;
	try {
		jwtPayload = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
	} catch (err: any) {
		return res.status(401).json({ message: 'Invalid credentials ' });
	}

	if (jwtPayload === undefined) return res.status(401).json({ message: 'Invalid credentials' });

	(res.locals as AccessTokenResponseLocals & AnyResponseLocals).jwtPayload = jwtPayload;
	next();
};
