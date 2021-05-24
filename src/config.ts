import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { logger } from "./utils/logger";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
}

export const REF_PRIVATE_KEY = process.env["REF_PRIVATE_KEY"];
export const DB_URI = process.env["DB_URI"];
export const PORT = Number.parseInt(process.env["PORT"]);
export const SWAGGER_ROUTE = process.env["SWAGGER_ROUTE"];
export const REF_SERVER_HOST = process.env["REF_SERVER_HOST"];
export const REF_SERVER_API_KEY = process.env["REF_SERVER_API_KEY"];
