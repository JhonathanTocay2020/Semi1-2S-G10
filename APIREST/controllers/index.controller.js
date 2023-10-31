import {pool} from "../config/configDB.js";

export const index = (req, res) => res.json(
    { message: "Bienvenido a mi api" }
);

export const pingdb = async (req, res) =>{
    let result = {
        mensaje: "",
    }

    try{
        const [Select] = await pool.query(`SELECT 'pong' as result;`);
        result.mensaje = Select[0].result;
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}