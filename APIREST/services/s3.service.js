import {configS3,BUCKET_IMG} from "../config/configS3.js";
import aws from 'aws-sdk';


// Insertar una imagen en amazon S3
export const guardarFoto = async (PathFoto, Imagen) => {
    aws.config.update(configS3);
    const s3 = new aws.S3();

    const paramsS3 = {
        Bucket: BUCKET_IMG,
        Key: PathFoto,
        Body: Buffer.from(Imagen, "base64"),
        ContentType: 'image'
    }

    try{
        const resultado = await s3.putObject(paramsS3).promise();
        console.log(resultado.data)
        return true
    }
    catch (error) {
        return false;
    }
}

// Eliminar una imagen en amazon S3
export const eliminarFotoS3 = async (PathFoto) => {
    const bucketParams = { Bucket: BUCKET_IMG, Key: PathFoto };

    aws.config.update(configS3);
    const s3 = new aws.S3();

    try{
        await s3.deleteObject(bucketParams).promise();
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export const obtenerFotoS3 = async (PathFoto) => {
    try{
        aws.config.update(configS3);
        const s3 = new aws.S3();

        const params = {
            Bucket: BUCKET_IMG,
            Key: PathFoto
            };
            
        const s3Object = await s3.getObject(params).promise();
        const imageBuffer = s3Object.Body;
        return imageBuffer;
    }
    catch (error){
        return null;
    }
}