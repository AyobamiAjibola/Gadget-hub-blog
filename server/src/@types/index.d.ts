declare namespace Express {
    export interface Request {
        user: string;
        admin: boolean;
        role: string;
    }
}