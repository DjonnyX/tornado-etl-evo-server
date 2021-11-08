
import * as jwt from "jsonwebtoken";
export * as config from "../config";
import { IAccount, IAccountInfo } from "@djonnyx/tornado-types";
import { refServerApiService } from "../services";
import { Controller, Route, Tags, Example, Request, Get, OperationId, Security, Post, Body } from "tsoa";
import { IAuthRequest, IBaseResponse } from "../interfaces";
import { IServerDocument, ServerModel } from "../models";

interface IInstallationEventResponse { }

interface IInstallationEventDataResponse {
    client: string;
    owner: string;
}

export enum InstallationEventTypes {
    /**
     * приложение активировано
     */
    APPLICATION_INSTALLED = "ApplicationInstalled",
    /**
     * приложение активировано
     */
    APPLICATION_UNINSTALLED = "деактивировано",
}

interface IInstallationEventData {
    /**
     * Идентификатор события.
     * Формат – uuid4, в соответствии с RFC.
     */
    id: string;
    /**
     * Дата и время отправки события, в миллисекундах
     * В формате unix timestamp.
     */
    timestamp: number;
    /**
     * Default: 2
     * Версия API, к которой относятся события.
     */
    version: number;
    /**
     * Типы событий
     */
    type: InstallationEventTypes | string;
    data: {
        productId: string;
        userId: string;
    }
}

const INSTALLATION_INFO_RESPONSE: IInstallationEventResponse = {};

@Route("/installation")
@Tags("Installation")
export class InstallationEventController extends Controller {
    @Post("/event")
    @Security("checkEvoCloudToken")
    @OperationId("InstallationEvent")
    @Example<IInstallationEventResponse>(INSTALLATION_INFO_RESPONSE)
    public async event(@Body() body: IInstallationEventData, @Request() request: IAuthRequest): Promise<IInstallationEventResponse> {
        let serverInfo: IServerDocument;

        if (body.type === InstallationEventTypes.APPLICATION_INSTALLED) {
            try {
                serverInfo = await ServerModel.findOne();
            } catch (err) {
                this.setStatus(500);
                console.error(`Get serverInfo error. ${err}`);
                return err;
            }
        }

        let accountsResponse: IBaseResponse<Array<IAccountInfo>, {}>;
        try {
            accountsResponse = await refServerApiService.getAccounts(
                {
                    "extra.userId.equals": body?.data?.userId,
                    all: "true",
                    secure: "true",
                }
            );
        } catch (err) {
            this.setStatus(500);
            console.error(`Get account error. ${err}`);
            return err;
        }

        const account = accountsResponse?.data?.[0];

        if (!account) {
            this.setStatus(500);
            console.error("User not found.");
            return;
        }

        let integrationInfo: {
            integrationId: string;
            serverName: string;
        };

        if (body.type === InstallationEventTypes.APPLICATION_INSTALLED) {
            integrationInfo = jwt.decode(serverInfo.token, {
                json: true,
            }) as any;
        }

        const extra: any = { ...account.extra, };
        let integrationId: string | null;
        if (body.type === InstallationEventTypes.APPLICATION_INSTALLED) {
            extra.evoProductId = body.data.productId;
            integrationId = integrationInfo.integrationId;
        } else {
            delete extra.evoProductId;
            integrationId = null;
        }

        let response: IBaseResponse<IAccountInfo, {}>;
        try {
            response = await refServerApiService.updateAccount(account.id, {
                integrationId,
                extra,
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
