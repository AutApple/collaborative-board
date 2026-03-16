export class ClientIdentity {
	constructor(
		public readonly userId: string,
		public readonly email: string,
		public readonly isBanned: boolean, 
		public readonly isAdmin: boolean
	) {
		console.log(userId, email, isBanned, isAdmin);
	}
}
