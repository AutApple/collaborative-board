import { env } from '../../config/env.config.js';
import jwt from 'jsonwebtoken';
import { ClientIdentity } from '../client/client-identity.js';

export class ApplicationAuthService {
    constructor() { }
    public authenticate(accessToken: string): ClientIdentity | null {
        try {
            const user = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as {
                userId: string; // extract just user id and email, nothing else is needed for now
                email: string;
            };
            return new ClientIdentity(user.userId, user.email);
        } catch (err: any) {
            return null;
        }
    }
}