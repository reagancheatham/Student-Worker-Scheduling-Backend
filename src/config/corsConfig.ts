export class CorsConfig {
    public origin: string;
    public credentials: boolean;
    
    constructor(origin: string, credentials: boolean) {
        this.origin = origin;
        this.credentials = credentials;
    }
}

export const defaultCorsConfig = new CorsConfig("http://localhost:8081", true);
