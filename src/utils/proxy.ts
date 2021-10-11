import { Controller } from "tsoa";
import * as got from "got";
import * as express from "express";
import * as config from "../config";
import { ServerError } from "../error";

export async function makeRequest<T = any>(request: got.GotPromise<any>): Promise<T> {
    let r: got.Response<any>;

    try {
        r = await request;
    } catch (err) {
        let serverResp: any;
        if (err instanceof got.HTTPError) {
            if (err.statusCode === 500) {
                try {
                    serverResp = JSON.parse(err.body as string);
                } catch (err1) {
                    throw Error(err1);
                }
            } else if (err.statusCode === 401) {
                throw ServerError.from(err.body);
            }
        }
        throw Error(!!serverResp && !!serverResp.error && !!serverResp.error.length
            ?
            serverResp.error[0].message
            :
            err
        );
    }

    let body: any;
    try {
        body = JSON.parse(r.body)
    } catch (err) {
        throw Error(`Response body from auth server bad format. Error: ${err}`);
    }
    return body as T;
}
