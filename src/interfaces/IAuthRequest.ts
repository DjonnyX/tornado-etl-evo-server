import * as express from "express";

export interface IAuthRequest extends express.Request {
    account?: IAuthInfo;
    token?: string;
}

export interface IAuthInfo {
    id: string;
}