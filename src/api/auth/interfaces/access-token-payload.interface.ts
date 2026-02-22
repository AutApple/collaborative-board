export interface AccessTokenPayload {
	userId: string;
	email: string;
	iat?: number; // issued at (added by jwt automatically)
	exp?: number; // expiration (added by jwt automatically)
}
