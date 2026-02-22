import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../../shared/config/env.config.js';
import type { AccessTokenDTOType } from '../dto/access-token.dto.js';
import type { AccessTokenPayload } from '../interfaces/access-token-payload.interface.js';

export const validateAccessToken = async (_: Request, res: Response<any, { dto: AccessTokenDTOType & Record<string, unknown>, jwtPayload: AccessTokenPayload }>, next: NextFunction) => {
        const jwtPayload = jwt.verify(res.locals.dto.accessToken, env.JWT_ACCESS_SECRET) as AccessTokenPayload;

        if (!jwtPayload)
            return res.status(401).json({ message: 'Invalid credentials' });

        res.locals.jwtPayload = jwtPayload;
        next();
    };