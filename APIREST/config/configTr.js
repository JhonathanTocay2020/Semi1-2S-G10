import { config } from "dotenv";
config();

// Translate
export const TR_REGION = process.env.TR_REGION;
export const TR_ACCESS_KEY_ID = process.env.TR_ACCESS_KEY_ID;
export const TR_SECRET_ACCESS_KEY = process.env.TR_SECRET_ACCESS_KEY;

export const configTranslate = {
    region: TR_REGION,
    accessKeyId: TR_ACCESS_KEY_ID,
    secretAccessKey: TR_SECRET_ACCESS_KEY
}