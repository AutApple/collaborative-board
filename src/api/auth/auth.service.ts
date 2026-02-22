import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../../shared/config/env.config.js';
import type { APIUserService } from '../user/user.service.js';
import type { LoginDTOType } from './dto/login.dto.js';
import type { RegisterDTOType } from './dto/register.dto.js';
import type { AuthTokens } from './interfaces/auth-tokens.interface.js';
import type { APIRefreshTokenService } from './refresh-token.service.js';
import type { AccessTokenPayload } from './interfaces/access-token-payload.interface.js';

export class APIAuthService {
	constructor(
		private refreshTokenService: APIRefreshTokenService,
		private userService: APIUserService,
	) {}

	private async generateAndStoreRefreshToken(userId: string): Promise<string> {
		const token = crypto.randomBytes(32).toString('base64url');
		await this.refreshTokenService.addRefreshToken(token, userId);
		return token;
	}

	private generateAccessToken(payload: AccessTokenPayload): string {
		return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
			expiresIn: env.JWT_ACCESS_EXPIRATION_SECONDS,
		});
	}

	private async makeTokens(payload: AccessTokenPayload): Promise<AuthTokens> {
		// generate refresh and access tokens
		const refreshToken = await this.generateAndStoreRefreshToken(payload.userId);
		const accessToken = this.generateAccessToken(payload);

		return {
			refreshToken,
			accessToken,
		};
	}

	public async login(dto: LoginDTOType): Promise<AuthTokens | null> {
		const { email } = dto;
		const user = await this.userService.getUser(email);
		if (!user) return null;

		if (!(await bcrypt.compare(dto.password, user.hashedPassword))) return null;
		return await this.makeTokens({ userId: user.id, email });
	}

	public async register(dto: RegisterDTOType) {
		const { email, username } = dto;

		const hashedPassword = await bcrypt.hash(dto.password, 10);
		const user = await this.userService.create({ email, username, hashedPassword });

		return await this.makeTokens({ userId: user.id, email });
	}

	public async logout(rawRefreshToken: string): Promise<boolean> {
		const result = await this.refreshTokenService.consumeRefreshToken(rawRefreshToken);
		console.log(result);
		return result === null ? false : true;
	}

	public async refresh(rawRefreshToken: string): Promise<AuthTokens | null> {
		// revoke it and make a new one, make a new access token as well
		const revokedToken = await this.refreshTokenService.consumeRefreshToken(rawRefreshToken);
		if (!revokedToken) return null;
		const user = await this.userService.getUserById(revokedToken.userId);
		if (!user) return null;
		return this.makeTokens({ userId: user.id, email: user.email });
	}
}
