export class ClientIdentity {
    constructor (private userId: string, private email: string) {}
    
    public getUserId(): string {
        return this.userId;
    }
    public getEmail(): string {
        return this.email;
    }
}