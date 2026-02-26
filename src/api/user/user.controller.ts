import type { AccessTokenPayload } from '../auth/interfaces/access-token-payload.interface.js';
import type { APIUserService } from './user.service.js';
import type { Response, Request } from 'express';
export class APIUserController {
	constructor(public readonly userService: APIUserService) {}
	public async me(_: Request, res: Response<any, { jwtPayload: AccessTokenPayload }>) {
		const user = await this.userService.getUserSafe(res.locals.jwtPayload.email);
		if (!user) res.status(404).json({ message: 'user not found' });
		res.status(200).json(user);
	}
}
