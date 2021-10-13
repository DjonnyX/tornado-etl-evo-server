import { IAccount, IAccountInfo, IIntegration } from "@djonnyx/tornado-types";
import * as jwt from "jsonwebtoken";
import * as config from "../config";
import { Controller, Route, Tags, Example, Request, Get, OperationId, Security, Post } from "tsoa";
import { IAuthRequest, IBaseResponse } from "../interfaces";
import { refServerApiService } from "../services";
import { ServerModel } from "../models";

interface IUserCreateResponse {
    userId: string;
    token: string;
}

interface IUserCreateDataResponse {
    client: string;
    owner: string;
}

interface IUserCreateData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userUuid: string;
    userId: string;
}

const USER_CREATE_INFO_RESPONSE: IUserCreateResponse = {
    userId: "01-000000000000001",
    token: "toaWaep4chou7ahkoogiu9Iusaht9ima",
}

interface IVerifyResponse {
    userId: string;
    token: string;
}

interface IVerifyDataResponse {
    account: IAccountInfo;
    token: string;
}

interface IVerifyData {
    email: string;
    password: string;
    userId: string;
}

const USER_VERIFY_INFO_RESPONSE: IVerifyResponse = {
    userId: "01-000000000000001",
    token: "toaWaep4chou7ahkoogiu9Iusaht9ima",
}

interface IUserTokenResponse { }

interface IUserTokenDataResponse {
    account: IAccountInfo;
    token: string;
}

interface IUserTokenData {
    userId: string;
    token: string;
}

const TOKEN_INFO_RESPONSE: IUserTokenResponse = {}
@Route("/user")
@Tags("User")
export class UserController extends Controller {
    @Post("/create")
    @Security("checkEvoCloudToken")
    @OperationId("Create")
    @Example<IUserCreateResponse>(USER_CREATE_INFO_RESPONSE)
    public async create(@Request() request: IAuthRequest): Promise<IUserCreateResponse> {
        const body = request.body as IUserCreateData;

        let host: string;

        try {
            const server = await ServerModel.findOne();
            host = (jwt.decode(server.token, {
                json: true,
            }) as { integrationId: string, serverName: string, serverHost: string; }).serverHost;
        } catch (err) {
            this.setStatus(500);
        }

        let integrationsResponse: IBaseResponse<Array<IIntegration>, {}>;
        try {
            integrationsResponse = await refServerApiService.getIntegrations({
                "host.equals": host,
            });
        } catch (err) {
            this.setStatus(500);
            console.error(err);
            return err;
        }

        const integration = integrationsResponse?.data?.[0];

        const data = {
            integrationId: integration.id,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
            extra: {
                userId: body.userId,
                userUuid: body.userUuid,
            }
        }

        let response: IBaseResponse<IUserCreateDataResponse, {}>;
        try {
            response = await refServerApiService.registration(data);
        } catch (err) {
            this.setStatus(500);
            console.error(err);
            return err;
        }

        const token = jwt.sign(
            { id: response.data.client, owner: response.data.owner, email: body.email, evoUserId: body.userId },
            config.AUTH_PRIVATE_KEY,
        );

        return {
            userId: body.userId,
            token,
        };
    }

    @Post("/verify")
    @Security("checkEvoCloudToken")
    @OperationId("Verify")
    @Example<IVerifyResponse>(USER_VERIFY_INFO_RESPONSE)
    public async verify(@Request() request: IAuthRequest): Promise<IVerifyResponse> {
        const body = request.body as IVerifyData;

        const data = {
            email: body.email,
            password: body.password,
        }

        let accounts: IBaseResponse<IAccountInfo, {}>;
        try {
            accounts = await refServerApiService.getAccounts({
                "email.equals": body.email,
                all: "true",
                secure: "true",
            });
        } catch (err) {
            this.setStatus(500);
            console.error(err);
            return err;
        }

        const account = accounts?.data?.[0];
        if (!account) {
            this.setStatus(500);
            const err = "Account not found.";
            console.error(err);
            return err as any;
        }

        let response: IBaseResponse<IVerifyDataResponse, {}>;
        try {
            response = await refServerApiService.authorization(data);
        } catch (err) {
            this.setStatus(500);
            console.error(err);
            return err;
        }

        try {
            await refServerApiService.updateAccount(account.id, {
                extra: {
                    userId: body.userId,
                },
            } as unknown as IAccount,
                {
                    secure: "true",
                }
            );
        } catch (err) {
            this.setStatus(500);
            console.error(err);
            return err;
        }

        const token = jwt.sign(
            { id: response.data.account.id, owner: response.data.account.owner, email: body.email, evoUserId: body.userId },
            config.AUTH_PRIVATE_KEY,
        );

        return {
            userId: body.userId,
            token,
        };
    }

    @Post("/token")
    @Security("checkEvoCloudToken")
    @OperationId("UserToken")
    @Example<IUserTokenResponse>(TOKEN_INFO_RESPONSE)
    public async token(@Request() request: IAuthRequest): Promise<IUserTokenResponse> {
        const body = request.body as IUserTokenData;

        const data = {
            userId: body.userId,
            token: body.token,
        }

        let accountResponse: IBaseResponse<Array<IAccountInfo>, {}>;
        try {
            accountResponse = await refServerApiService.getAccounts(
                {
                    "extra.userId.equals": data.userId,
                    all: "true",
                    secure: "true",
                }
            );
        } catch (err) {
            this.setStatus(500);
            console.error(err);
            return err;
        }

        const account = accountResponse?.data?.[0];

        if (!account) {
            this.setStatus(500);
            console.error("User not found.");
            return;
        }

        let response: IBaseResponse<IAccountInfo, {}>;
        try {
            response = await refServerApiService.updateAccount(account.id, {
                extra: { ...account.extra, evoAppToken: data.token },
            } as unknown as IAccount,
                {
                    secure: "true",
                }
            );
        } catch (err) {
            this.setStatus(500);
            console.error(err);
            return err;
        }

        this.setStatus(200);
    }
}