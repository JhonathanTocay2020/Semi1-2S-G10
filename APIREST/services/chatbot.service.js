import { sendToLex } from "../config/configLEX.js";
import { validarToken } from "../services/jwt.service.js";
const horas = [];
export const Chatbot = async (req, res) => {
  try {
    const user = await validarToken(req.headers["access-token"]);
    if (user == null) {
      return res.status(401).json({ respuesta: "Acceso Denegado" });
    }
    const { message } = req.body;
    const resp = await sendToLex(user.id, message);
    if (resp.intentName == "FuncionDos" && resp.slots.hora != null) {
      horas.push(resp.slots.hora);
      return res
        .status(200)
        .json({ respuesta: "Vale, le notificaremos cuando sea la hora" });
    }
    return res.status(200).json({ respuesta: resp.message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Ocurrio un error" });
  }
};

export const aviso = async (req, res) => {
  try {
    const { hora, minuto } = req.body;
    if (horas.length > 4) {
      horas.splice(0, horas.length);
    }
    if (horas.length != 0) {
      const prueba = notificacion(horas, hora, minuto);
      if (prueba == true) {
        return res.status(200).json({ respuesta: "Es hora de tu clase" });
      } else {
        return res.status(500).json({ error: "Aun no es hora" });
      }
    } else {
      return res.status(500).json({ error: "No hay hora especificada" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Ocurrio un error" });
  }
};
function notificacion(horaEspecifica, hora, minuto) {
  var condicion = false;
  console.log(horaEspecifica, hora, minuto);
  horaEspecifica.forEach((tiempo) => {
    if (tiempo.slice(0, 2) == hora && tiempo.slice(3) == minuto) {
      condicion = true;
      return;
    }
  });
  return condicion;
}
/*    
    }*/
