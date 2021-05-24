import * as express from "express";
import * as cors from "cors";
import * as bodyparser from "body-parser";
import { requestLoggerMiddleware } from "./middlewares/requestLoggerMiddleware";
import { RegisterRoutes } from "./routes";
import * as swaggerUI from "swagger-ui-express";
import * as config from "./config";
import { ServerError } from "./error";

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, x-www-form-urlencoded, X-Requested-With, Content-Type, Accept, x-authorization, x-access-token",
    );

    next();
});
app.use(cors());
app.use(bodyparser({
    limit: "50mb",
    extended: true,
}));

if (process.env.NODE_ENV !== "production") {
    app.use(requestLoggerMiddleware);
    RegisterRoutes(app);
}

app.use((err: any | ServerError, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    const serverError = ServerError.from(err, status);
    const body = {
        error: [{
            message: serverError.message,
            code: serverError.code,
        }]
    };
    res.status(status).json(body);
    next();
});

try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerDocument = require("../swagger.json");
    app.use(config.SWAGGER_ROUTE, swaggerUI.serve, swaggerUI.setup(swaggerDocument));
} catch (err) {
    console.error("Unable to read swagger.json", err);
}

export { app };