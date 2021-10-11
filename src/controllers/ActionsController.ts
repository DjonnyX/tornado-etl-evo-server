import { Controller, Route, Tags, Example, Request, Get, OperationId, Security } from "tsoa";
import { IAuthRequest, IBaseResponse } from "../interfaces";
import { IAccountInfo } from "@djonnyx/tornado-types";
import { IEvoStore } from "src/interfaces/evotor";
import { evoCloudApiService } from "../services/EvoCloudApiService";
import { refServerApiService } from "../services";

@Route("/actions")
@Tags("Actions")
export class ActionsController extends Controller {
    @Get("/sync")
    @Security("checkEvoCloudToken")
    @OperationId("Get")
    public async sync(@Request() request: IAuthRequest): Promise<void> {
        let accountResponse: IBaseResponse<Array<IAccountInfo>, {}>;
        try {
            accountResponse = await refServerApiService.getAccounts();
        } catch (err) {
            this.setStatus(500);
            console.error(err);
            return err;
        }

        const accountsMap: { [userId: string]: IAccountInfo } = {};

        for (const account of accountResponse.data) {
            if (account?.extra?.userId) {
                accountsMap[account?.extra?.userId] = account;
            }
        }
    }
}

const syncStores = async (accounts: Array<IAccountInfo>, accountsMap: { [userId: string]: IAccountInfo }): Promise<void> => {
    /*let stores: Array<IEvoStore>;

    try {
        stores = await refServerApiService.getStores();
    } catch (err) {
        this.setStatus(500);
        return {
            error: [
                {
                    code: 500,
                    message: `Error in getting evoStores. ${err}.`,
                }
            ]
        }
    }

    let evoStores: Array<IEvoStore>;
    try {
        evoStores = await evoCloudApiService.getStores();
    } catch (err) {
        this.setStatus(500);
        return {
            error: [
                {
                    code: 500,
                    message: `Error in getting evoStores. ${err}.`,
                }
            ]
        }
    }

    const storesMap: { [userId: string]: IAccountInfo } = {};

    for (const store of stores) {
        if (store?.id) {
            storesMap[store?.id] = store;
        }
    }

    const promises = new Array<Promise<any>>();
    for (const store of stores) {
        promises.push(
            new Promise((resolve, reject) => {
                const account = accountsMap[store.user_id];
                if (!!account) {

                }
            })
        );
    }*/
}