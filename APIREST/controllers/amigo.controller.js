import {pool} from "../config/configDB.js";
import { URL_S3 } from "../config/configS3.js";
import {validarToken} from "../services/jwt.service.js";

// Listar todos aquellos usuarios que no han sido agregados
export const listadoDesconocidos = async (req, res) => {
    let result = {
        mensaje: "",
        usuarios: []
    }

    try{
        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        const [Select] = await pool.query(
            `SELECT usr.id, usr.nombre FROM Usuario usr
            WHERE (SELECT Count(*) FROM Amigo am WHERE am.usuario1 = usr.id OR usuario2 = usr.id) < 1
            AND NOT usr.id = '${user.id}';`);

        result.mensaje = "Usuarios obtenidos correctamente"
        result.usuarios = Select
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}

// Mandar una solicitud de amistad de un amigo
export const agregarAmigo = async (req, res) => {
    let result = {
        mensaje: "",
        agregado: false
    }

    try{
        const {usuario} = req.body

        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        await pool.query(
            `INSERT INTO Amigo (usuario1, usuario2, estado)
            VALUES ('${user.id}', '${usuario}', 0) `);

        result.mensaje = "Solicitud enviada correctamente"
        result.agregado = true
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}

// Listar soliciutdes de amistad
export const solicitudAmistad = async (req, res) => {
    let result = {
        mensaje: "",
        solicitudes: []
    }

    try{
        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        const [Select] = await pool.query(
            `SELECT am.id, usr.nombre FROM Amigo am
            INNER JOIN Usuario usr on usr.id = am.usuario1
            WHERE am.usuario2 = '${user.id}' and am.estado = 0 ;`);

        result.mensaje = "Solicitudes de amistad obtenidas correctamente"
        result.solicitudes = Select;
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
	
}

// aceptar una solicitud de amistad
export const aceptarAmigo = async (req, res) => {
    let result = {
        mensaje: "",
        correcto: false
    }

    try{
        const id_solicitud = req.params.solicitud;
        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }


        await pool.query(
            `UPDATE Amigo
            SET estado = 1
            WHERE id = ${id_solicitud};`);

        result.mensaje = "Solicitud aceptada"
        result.correcto = true
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}

// rechazar una solicitud de amistad
export const rechazarAmigo = async (req, res) => {
    let result = {
        mensaje: "",
        correcto: false
    }

    try{
        const id_solicitud = req.params.solicitud;

        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        await pool.query(
            `DELETE FROM Amigo WHERE id = ${id_solicitud}`)

        result.mensaje = "Solicitud rechazada correctamente"
        result.correcto = true
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}


export const getPublicacionAmigo = async (req, res) =>{
    let result = {
        mensaje: "",
        publicaciones: []
    }

    try{
        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        const [Select] = await pool.query(
            `(SELECT pu.id, usr.nombre, pu.nombre_foto, pu.url_foto, pu.descripcion FROM Publicacion pu
                INNER JOIN Usuario usr ON usr.id = pu.usuario
                INNER JOIN Amigo am on am.usuario1 = usr.id
                WHERE (SELECT Count(*) FROM Amigo am WHERE am.usuario1 = usr.id and usuario2 = '${user.id}') > 0
                AND NOT usr.id = '${user.id}'
                )
                UNION
                (SELECT pu.id, usr.nombre, pu.nombre_foto, pu.url_foto, pu.descripcion FROM Publicacion pu
                INNER JOIN Usuario usr ON usr.id = pu.usuario
                INNER JOIN Amigo am on am.usuario2 = usr.id
                WHERE (SELECT Count(*) FROM Amigo am WHERE am.usuario2 = usr.id and usuario1 = '${user.id}') > 0
                AND NOT usr.id = '${user.id}'
                );`);

        result.mensaje = "Publicaciones obtenidas correctamente"
        result.publicaciones = Select.map(item => { item.url_foto = URL_S3+ item.url_foto; return item})
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}