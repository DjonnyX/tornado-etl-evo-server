
import { Controller, Route, Tags, Example, Request, Get, OperationId, Security, Post } from "tsoa";
import { IAuthRequest } from "../interfaces";

interface IInstallationEventResponse { }

interface IInstallationEventDataResponse {
    client: string;
    owner: string;
}

interface IInstallationEventData {
    id: string;
    timestamp: number;
    version: number;
    type: "ApplicationInstalled" | "ApplicationUninstalled";
    data: {
        productId: string;
        userId: string;
    }
}

const REGISTRATION_INFO_RESPONSE: IInstallationEventResponse = {}

@Route("/installation")
@Tags("Installation")
export class InstallationEventController extends Controller {
    @Post("/event")
    @Security("checkEvoCloudToken")
    @OperationId("InstallationEvent")
    @Example<IInstallationEventResponse>(REGISTRATION_INFO_RESPONSE)
    public async event(@Request() request: IAuthRequest): Promise<IInstallationEventResponse> {
        return {};
    }
}
