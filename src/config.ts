import * as dotenv from "dotenv";
import * as fs from "fs";
import { logger } from "./utils/logger";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
}

export const DB_URI = process.env["DB_URI"];
export const PORT = Number.parseInt(process.env["PORT"]);
export const SWAGGER_ROUTE = process.env["SWAGGER_ROUTE"];
export const REF_SERVER_HOST = process.env["REF_SERVER_HOST"];
/**
 * Ключь которым генерируется токен пользователя
 */
export const AUTH_PRIVATE_KEY = process.env["AUTH_PRIVATE_KEY"];
/**
 * Хост облака Эвотор
 */
export const EVO_API_HOST = process.env["EVO_API_HOST"];
/**
 * Токен доступа
 */
export const EVO_CLOUD_TOKEN  = process.env["EVO_CLOUD_TOKEN"];
/**
 * Ключ доступа издателя Evo
 */
export const PUBLISHER_PASSKEY  = process.env["PUBLISHER_PASSKEY"];