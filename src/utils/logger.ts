import * as winston from "winston";

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "tornado-server" },
    transports: [
        new winston.transports.File({ dirname: "logs", filename: "error.log", level: "error" }),
        new winston.transports.File({ dirname: "logs", filename: "combined.log" }),
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console(
        {
            format: winston.format.simple(),
        }
    ));
}