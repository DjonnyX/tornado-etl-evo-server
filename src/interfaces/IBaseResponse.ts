import { IErrorResponse } from './IErrorResponse';

export interface IBaseResponse<T, M> {
    meta?: M;
    error?: IErrorResponse;
    data?: T;
}