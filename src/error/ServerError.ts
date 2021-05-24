import { ErrorCodes } from "./ErrorCodes";

interface IErrorResult {
    code: number;
    message: string;
}

export class ServerError extends Error {
    public static from(error: any | Array<IErrorResult>, status?: number): ServerError {
        const code = !!error && error.length > 0 && !!error[0]?.code ? error[0].code : error?.code || ErrorCodes.UNKNOWN;
        const message = !!error && error.length > 0 && !!error[0]?.message ? error[0].message : error?.message || "Unknown error";
        const errInstance = new ServerError(message, code, status || 500);
        return errInstance;
    }

    public static isServerError(error: Array<IErrorResult> | any): boolean {
        return !!error && error.length > 0 && !!error[0]?.code;
    }

    get isUnknown() { return this.code === ErrorCodes.UNKNOWN; }

    constructor(
        message: string,
        public readonly code: ErrorCodes = ErrorCodes.UNKNOWN,
        public readonly status: number = 500,
    ) {
        super(message);
    }

    public toJSON(): IErrorResult {
        return {
            message: this.message || "Неизвестная ошибка",
            code: this.code || ErrorCodes.UNKNOWN,
        }
    }
}