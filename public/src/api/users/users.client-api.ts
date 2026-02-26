export interface ClientUsersAPIResult {
	email: string;
	username: string;
	createdAt: Date;
}

class ClientUsersAPI {
	constructor(private url: string) {}

	async getMe(accessToken: string): Promise<ClientUsersAPIResult | null> {
		const response = await fetch(`${this.url}/me`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
		if (!response.ok) return null;

		const result = await response.json();
		if (!result.email || !result.username || !result.createdAt) return null;
		return result;
	}
}

const usersApi = new ClientUsersAPI('/api/users');
export default usersApi;
