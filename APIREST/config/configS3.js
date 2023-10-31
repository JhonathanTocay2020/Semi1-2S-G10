import { config } from "dotenv";
config();

// S3
export const BUCKET_IMG = process.env.BUCKET_IMG;
export const S3_REGION = process.env.S3_REGION;
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
export const URL_S3 = process.env.URL_S3;

export const configS3 = {
    region: S3_REGION,
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY
}