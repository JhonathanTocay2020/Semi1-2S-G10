import { config } from "dotenv";
config();

// Rekognition
export const RK_REGION = process.env.RK_REGION;
export const RK_ACCESS_KEY_ID = process.env.RK_ACCESS_KEY_ID;
export const RK_SECRET_ACCESS_KEY = process.env.RK_SECRET_ACCESS_KEY;

export const configRK = {
    region: RK_REGION,
    accessKeyId: RK_ACCESS_KEY_ID,
    secretAccessKey: RK_SECRET_ACCESS_KEY
}