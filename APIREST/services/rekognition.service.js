import {configRK} from "../config/configRK.js";
import aws from 'aws-sdk';

export const obtenerEtiquetas = async (imagen) =>{
    let etiquetas = []

    //Configuracion
    aws.config.update(configRK);
    const rekognition = new aws.Rekognition();
       
    const params = {
        Image: { 
            Bytes: Buffer.from(imagen, 'base64')
        },
        MaxLabels: 15,
        MinConfidence: 90
    };
    
    try {
        const respuesta = await rekognition.detectLabels(params).promise();
        etiquetas = respuesta.Labels.map(label => label.Name);
        return etiquetas;
    } catch (error) {
        console.log(error);
        return [];
    }
}


export const compararFotoRK = async (FotoPerfil, Imagen) =>{
    //Configuracion
    aws.config.update(configRK);
    const rekognition = new aws.Rekognition();

    const params = {
    SourceImage: {
        Bytes: Buffer.from(Imagen, 'base64')
    },
    TargetImage: {
        Bytes: FotoPerfil
    },
    SimilarityThreshold: 90
    };

   
   try {
        const result = await rekognition.compareFaces(params).promise();
        for(let i = 0; i<result.FaceMatches.length; i++){
            if (result.FaceMatches[0].Similarity > 90){
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}
