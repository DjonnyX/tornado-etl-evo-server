import { app } from "./app";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";

import * as mongoose from "mongoose";
import * as config from "./config";

const PORT = config.PORT;
const MONGO_URI = `mongodb://${config.DB_URI}`;

/*const httpsOptions = {
    key: fs.readFileSync("keystore/key.pem"),
    cert: fs.readFileSync("keystore/cert.pem")
};*/

const server = http.createServer(app); //https.createServer(httpsOptions, app);
server.listen(PORT);
server.on("listening", () => {
    console.info(`Listening on port ${PORT}.`);
    dbConnect();
});

async function dbConnect() {
    mongoose.connection.on("open", async () => {
        console.info("Connected to Mongo.");

        // await initRootEnvironment();
    });
    mongoose.connection.on("error", err => {
        console.error(err);
    });

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
        });
    } catch (err) {
        console.info("Connection to db failed.");
        return setTimeout(dbConnect, 1000);
    }
}

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on("uncaughtException", () => {
    process.kill(process.pid, 'SIGTERM');
});