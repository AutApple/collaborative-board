import { SignUpValidationErrorSchema } from './sign-up-error.schema.js';

export class AuthValidationError extends Error {
  public errors: { field: string; message: string }[];

  constructor(errors: { field: string; message: string }[]) {
    super("Validation error");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

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

        if (!response.ok)
            throw new Error('Invalid credentials');
		
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
			const raw = await response.json();

            const parsed = SignUpValidationErrorSchema.safeParse(raw);

            if (!parsed.success) {
                throw new Error("Unexpected error");
            }

            const errorData = parsed.data;
            throw new AuthValidationError(errorData.errors);
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
                const parsed = JSON.parse(error);
                throw new Error(parsed || 'Failed to logout');
            }
            const result = await response.json();
            if (result.success === undefined)  throw new Error('Unexpected error on logout');
            return result.success;
        }

}

const authApi = new ClientAuthAPI('/api/auth');
export default authApi;
