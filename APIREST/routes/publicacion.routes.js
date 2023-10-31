import { Router } from "express";
import {
  getEtiquetas,
  getFotosPerfil,
  getPublicacionesEtiqueta,
  getPublicacionesTodas,
  subirFoto,
  crearComentario,
  getComentario,
} from "../controllers/publicacion.controller.js";

const router = Router();

router.get("/get-fotos-perfil", getFotosPerfil);
router.get("/get-publicacion-todo", getPublicacionesTodas);
router.get("/get-etiquetas", getEtiquetas);
router.get("/get-publicacion/:etiqueta", getPublicacionesEtiqueta);
router.get("/get-comentario/:publicacion", getComentario);

router.post("/subir-foto", subirFoto);
router.post("/comentario", crearComentario);

export default router;
