import { app } from "./app";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";

import * as config from "./config";

const PORT = config.PORT;

/*const httpsOptions = {
    key: fs.readFileSync("keystore/key.pem"),
    cert: fs.readFileSync("keystore/cert.pem")
};*/

const server = http.createServer(app); //https.createServer(httpsOptions, app);
server.listen(PORT);
server.on("listening", () => {
    console.info(`Listening on port ${PORT}.`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on("uncaughtException", () => {
    process.kill(process.pid, 'SIGTERM');
});