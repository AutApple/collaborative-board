import type { PrismaClient, RefreshToken } from '../../board-app/generated/prisma/client.js';

export class APIRefreshTokenRepository {
    constructor (private dbClient: PrismaClient) {}
    

    public async findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
        return this.dbClient.refreshToken.findFirst({where: { tokenHash }})
    } 
    public async findValidRefreshTokens(email: string): Promise<RefreshToken[]> {
        const tokens = await this.dbClient.refreshToken.findMany({where: { user: { email }, revoked: false }});
        return tokens;
    }
    
    public async addRefreshToken(tokenHash: string, userId: string, expiresAt: Date): Promise<RefreshToken> {
       return this.dbClient.refreshToken.create({
            data: {
                expiresAt,
                tokenHash,
                userId
            }
       }); 
    }

    public async revokeRefreshToken(id: string): Promise<RefreshToken | null> {
        return this.dbClient.refreshToken.update({where: {id}, data: {revoked: true}});
    }
}