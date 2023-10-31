import jwt from "jsonwebtoken";
import {SECRET} from "../config/config.js";

// Crear un token del json de un usuario
export const crearToken = async (usuario) =>{
    const token = jwt.sign({id: usuario}, SECRET, { expiresIn: '24h' });
    console.log(token)
    return token;
}

// Verificamos el token para saber si es valido
export const validarToken = async (token) =>{
    try{
        const decoded = jwt.verify(token, SECRET);
        return decoded;
    }
    catch(error){
        console.log(error);
        return null
    }
}