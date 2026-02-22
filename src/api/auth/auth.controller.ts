import type { Request, Response } from 'express';
import { Prisma } from '../../board-app/generated/prisma/client.js';
import type { APIAuthService } from './auth.service.js';
import type { RefreshTokenDTOType } from './dto/refresh-token.dto.js';
import type { LoginDTOType } from './dto/login.dto.js';
import type { RegisterDTOType } from './dto/register.dto.js';

export class APIAuthController {
	constructor(public readonly authService: APIAuthService) {}

	public async login(_: Request, res: Response<any, { dto: LoginDTOType }>) {
		const tokens = await this.authService.login(res.locals.dto);
		if (!tokens) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}
		res.status(200).json(tokens);
	}

	public async register(_: Request, res: Response<any, { dto: RegisterDTOType }>) {
		try {
			const tokens = await this.authService.register(res.locals.dto);
			res.status(201).json(tokens);
		} catch (err) {
			// uniqueness check
			if (err instanceof Prisma.PrismaClientKnownRequestError)
				if (err.code === 'P2002') return res.status(409).json({ message: 'User already exists' });
			throw err;
		}
	}

	public async logout(_: Request, res: Response<any, { dto: RefreshTokenDTOType }>) {
		const success = await this.authService.logout(res.locals.dto.refreshToken);
		res.status(200).json({ success });
	}
	public async refresh(_: Request, res: Response<any, { dto: RefreshTokenDTOType }>) {
		const result = await this.authService.refresh(res.locals.dto.refreshToken);
		if (!result) {
			res.status(401).json({ message: 'Invalid credentials' });
			return;
		}
		res.status(200).json(result);
	}
}
