import * as express from "express";

const requestLoggerMiddleware = (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const start = new Date().getTime();
    resp.on("finish", () => {
        const elapsed = new Date().getTime() - start;
        console.info(`${req.method} ${req.originalUrl} ${resp.statusCode} ${elapsed}ms`);
        console.info(`${req.method}, ${JSON.stringify(req.query)}, ${JSON.stringify(req.headers)}, ${JSON.stringify(req.body)}`)
    });
    next();
};

export { requestLoggerMiddleware };