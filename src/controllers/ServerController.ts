import { Controller, Route, Tags, Example, Request, Get, OperationId, Security, Post, Body } from "tsoa";
import { IAuthRequest } from "../interfaces";
import { IServerDocument, ServerModel } from "../models";

interface IServerResponse {
    error?: Array<{
        code: number;
        message: string;
    }>;
}

@Route("/server")
@Tags("Server")
export class ServerController extends Controller {
    @Post("/token")
    //@Security("clientAccessToken")
    @OperationId("SetServerToken")
    @Example<IServerResponse>({})
    public async setToken(@Body() body: { token: string }, @Request() request: IAuthRequest): Promise<IServerResponse> {
        let server: IServerDocument;
        try {
            server = await ServerModel.findOne();
        } catch (err) {
            this.setStatus(500);
            return {
                error: [
                    {
                        code: 500,
                        message: `Error in reading server config. ${err}`,
                    }
                ]
            };
        }

        server.token = body.token;

        try {
            await server.save();
        } catch (err) {
            this.setStatus(500);
            return {
                error: [
                    {
                        code: 500,
                        message: `Error in saving server config. ${err}`,
                    }
                ]
            };
        }

        return {};
    }
}
