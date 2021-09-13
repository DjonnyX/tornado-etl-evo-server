import * as config from "./config";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import { IAuthRequest, IClientJWTBody } from "./interfaces";
import { ErrorCodes, ServerError } from "./error";

const checkClientToken = async (token: string, request: express.Request) => {
  return new Promise<void>((resolve, reject) => {
    if (!token) {
      return reject(new ServerError("Token is empty.", ErrorCodes.CLIENT_TOKEN_EMPTY_TOKEN, 401));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt.verify(token, config.AUTH_PRIVATE_KEY, async function (err: any, decoded: IClientJWTBody) {
      if (err) {
        return reject(new ServerError(err.message, ErrorCodes.CLIENT_TOKEN_VERIFICATION, 401));
      }

      if (!decoded.id || !decoded.email) {
        return reject(new ServerError(err.message, ErrorCodes.CLIENT_TOKEN_BAD_FORMAT, 401));
      }

      (request as IAuthRequest).account = {
        id: decoded.id,
      };
      (request as IAuthRequest).token = token;

      return resolve();
    });
  });
}

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (securityName === "clientAccessToken") {
    const authorization = request.headers["authorization"] ? String(request.headers["authorization"]) : undefined;
    let token = authorization ? authorization.replace("Bearer ", "") : undefined;

    return await checkClientToken(token, request);
  }
}