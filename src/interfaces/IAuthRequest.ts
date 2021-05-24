import * as express from "express";
import { ILicense, TerminalTypes } from "@djonnyx/tornado-types";

export interface IAuthRequest extends express.Request {
    account?: IAuthInfo;
    terminal?: ITerminalAuthInfo;
    token?: string;
}

export interface IAuthInfo {
    id: string;
}

export interface ITerminalAuthInfo {
    imei: string;
    key: string;
    type: TerminalTypes;
    license: ILicense;
}