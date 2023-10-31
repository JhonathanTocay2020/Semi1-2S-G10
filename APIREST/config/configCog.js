import { config } from "dotenv";
config();

export const C_REGION = process.env.C_REGION;
export const C_ACCESS_KEY_ID = process.env.C_ACCESS_KEY_ID;
export const C_SECRET_ACCESS_KEY = process.env.C_SECRET_ACCESS_KEY;
export const APP_CLIENT_ID = process.env.APP_CLIENT_ID;
export const USER_POOL= process.env.USER_POOL;

export const configCognito = {
    region: C_REGION,
    accessKeyId: C_ACCESS_KEY_ID,
    secretAccessKey: C_SECRET_ACCESS_KEY
}