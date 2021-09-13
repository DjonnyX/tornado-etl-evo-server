export interface IClientJWTBody {
    id: string;
    owner: string;
    email: string;
    iat: number;
    exp: number;
}