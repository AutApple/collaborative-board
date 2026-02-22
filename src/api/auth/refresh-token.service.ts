import { env } from '../../../shared/config/env.config.js';
import type { RefreshToken, User } from '../../board-app/generated/prisma/client.js';
import type { APIRefreshTokenRepository } from './refresh-token.repo.js';
import crypto from 'crypto';

export class APIRefreshTokenService {
    constructor (private refreshTokenRepo: APIRefreshTokenRepository) {  }
    
    private isTokenValid(token: RefreshToken): boolean {
        return !token.revoked && token.expiresAt > new Date();
    }

    public async getValidRefreshToken(rawToken: string): Promise<RefreshToken | null> {
            const hashedToken = crypto.createHmac('sha256', env.JWT_REFRESH_SECRET).update(rawToken).digest('hex');
            const token = await this.refreshTokenRepo.findRefreshTokenByHash(hashedToken);
            
            if (!token || !this.isTokenValid(token))
                return null; 
            return token;
    }
    
    public async addRefreshToken(rawToken: string, userId: string): Promise<RefreshToken> {
        const hashedToken = crypto.createHmac('sha256', env.JWT_REFRESH_SECRET).update(rawToken).digest('hex');
        
        const now = new Date();
        const expirationDate = new Date(now);
        expirationDate.setDate(expirationDate.getDate() + env.JWT_REFRESH_EXPIRATION_DAYS);
        
        return await this.refreshTokenRepo.addRefreshToken(hashedToken, userId, expirationDate);
    }

    public async consumeRefreshToken(rawRefreshToken: string): Promise<RefreshToken | null> {
            const token = await this.getValidRefreshToken(rawRefreshToken);
            if (!token)
                return null;
            return await this.refreshTokenRepo.revokeRefreshToken(token.id);
     }
}