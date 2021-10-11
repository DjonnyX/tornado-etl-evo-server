import { IServerDocument, ServerModel } from "../models";

const createServerConfig = async (): Promise<void> => {
    let server: IServerDocument;
    server = await ServerModel.findOne();

    if (!server) {
        server = new ServerModel();
        await server.save();
    }
}

export const initRootEnvironment = async (): Promise<void> => {
    try {
        await createServerConfig();
    } catch (err) {
        // etc
        console.error(`Error in creating server config. ${err}`);
    }

    console.info(`Environment is initialized.`);
};