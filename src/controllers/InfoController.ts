import { Controller, Route, Tags, Example, Request, Get, OperationId, Security } from "tsoa";
import { IAuthRequest } from "../interfaces";
import { UserRights } from "@djonnyx/tornado-types";
import { version } from '../../package.json';
import { AVAILABLE_RIGHTS } from "./RightsController";

interface IInfoResponse {
    meta?: IInfoMeta;
    data?: IInfoData;
    error?: Array<{
        code: number;
        message: string;
    }>;
}

interface IInfoMeta {}

interface IInfoData {
    name: string;
    serverVersion: string;
    availableRights: Array<UserRights>;
}

const META_TEMPLATE: IInfoMeta = {};

const INFO_RESPONSE: IInfoData = {
    name: "Evotor",
    serverVersion: version,
    availableRights: AVAILABLE_RIGHTS,
}

@Route("/Info")
@Tags("Info")
export class InfoController extends Controller {
    @Get()
    @Security("clientAccessToken")
    @OperationId("Get")
    @Example<IInfoResponse>({
        meta: META_TEMPLATE,
        data: INFO_RESPONSE,
    })
    public async getRights(@Request() request: IAuthRequest): Promise<IInfoResponse> {
        return {
            meta: {},
            data: INFO_RESPONSE,
        }
    }
}
