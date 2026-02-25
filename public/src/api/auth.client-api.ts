class ClientAuthAPI {
    private accessToken: string | undefined;
	constructor(private url: string) {}
	
    async getAccessToken(): Promise<string | null> {
		if (this.accessToken) return this.accessToken;
        const response = await fetch(`${this.url}/refresh`, { method: 'POST', credentials: 'include' });
		if (!response.ok) return null;

		const tokens = await response.json();
		if (!tokens.accessToken) return null;
        this.accessToken = tokens.accessToken; 
        return tokens.accessToken;
	}
    
    async login(email: string, password: string): Promise<string> {
        const response = await fetch(`${this.url}/login`, { method: 'POST', 
            headers: {
				'Content-Type': 'application/json',
			},
            credentials: 'include', 
            body: JSON.stringify({ email, password }),
         });

        if (!response.ok) {
			const error = await response.json();
			throw new Error(error || 'Failed to login');
		}
        const data = await response.json();
        if (!data.accessToken) throw new Error('Did not recieve access token');
        return data.accessToken;
    }

    async register(email: string, username: string, password: string, confirmPassword: string): Promise<string> {
        const response = await fetch(`${this.url}/register`, { method: 'POST', 
            headers: {
				'Content-Type': 'application/json',
			},
            credentials: 'include', 
            body: JSON.stringify({ email, password, username, confirmPassword }),
         });

        if (!response.ok) {
			const error = await response.json();
			throw new Error(error || 'Failed to register');
		}
        const data = await response.json();
        if (!data.accessToken) throw new Error('Did not recieve access token');
        return data.accessToken;
    }

        async logout(): Promise<boolean> {
            const response = await fetch(`${this.url}/logout`, { method: 'POST', 
                credentials: 'include', 
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error || 'Failed to logout');
            }
            const result = await response.json();
            if (result.success === undefined)  throw new Error('Unexpected error on logout');
            return result.success;
        }

}

const authApi = new ClientAuthAPI('/api/auth');
export default authApi;
