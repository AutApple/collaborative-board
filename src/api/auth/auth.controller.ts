import type { Request, Response } from 'express';
import { Prisma } from '../../board-app/generated/prisma/client.js';
import type { APIAuthService } from './auth.service.js';
import type { LoginDTOType } from './dto/login.dto.js';
import type { RegisterDTOType } from './dto/register.dto.js';
import { env } from '../../../shared/config/env.config.js';
import type { DtoResponseLocals } from '../common/middleware/validate-dto.middleware.js';

export class APIAuthController {
	constructor(public readonly authService: APIAuthService) {}

	private setRefreshTokenCookie(res: Response, token: string) {
		res.cookie('refresh_token', token, {
			httpOnly: true,
			secure: env.NODE_ENV === 'PROD' ? true : false,
			sameSite: 'strict',
			// path: '/api/auth/refresh',
			maxAge: 1000 * 60 * 60 * 24 * env.JWT_REFRESH_EXPIRATION_DAYS,
		});
	}
	private resetRefreshTokenCookie(res: Response) {
		res.cookie('refresh_token', '', {
			httpOnly: true,
			secure: env.NODE_ENV === 'PROD' ? true : false,
			sameSite: 'strict',
			// path: '/api/auth/refresh',
			maxAge: 0,
		});
	}

	public async login(_: Request, res: Response<any, DtoResponseLocals<LoginDTOType>>) {
		const tokens = await this.authService.login(res.locals.dto);
		if (!tokens) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		this.setRefreshTokenCookie(res, tokens.refreshToken);
		res.status(200).json({ accessToken: tokens.accessToken });
	}

	public async register(_: Request, res: Response<any, DtoResponseLocals<RegisterDTOType>>) {
		try {
			const tokens = await this.authService.register(res.locals.dto);
			this.setRefreshTokenCookie(res, tokens.refreshToken);
			res.status(201).json({ accessToken: tokens.accessToken });
		} catch (err) {
			// uniqueness check
			if (err instanceof Prisma.PrismaClientKnownRequestError)
				if (err.code === 'P2002')
					return res
						.status(409)
						.json({
							errors: [{ field: 'email', message: 'User with specified email already exists' }],
						});
			throw err;
		}
	}

	public async logout(req: Request, res: Response) {
		const refreshToken = req.cookies.refresh_token;

		if (!refreshToken) {
			res.status(401).json({ success: false });
			return;
		}

		const success = await this.authService.logout(refreshToken);
		if (success) this.resetRefreshTokenCookie(res);
		res.status(200).json({ success });
	}
	public async refresh(req: Request, res: Response) {
		const refreshToken = req.cookies.refresh_token;
		if (!refreshToken) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		const tokens = await this.authService.refresh(refreshToken);
		if (!tokens) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}

		this.setRefreshTokenCookie(res, tokens.refreshToken);
		res.status(200).json({ accessToken: tokens.accessToken });
	}
}
