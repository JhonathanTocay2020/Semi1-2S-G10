import { Router } from "express";
import {aceptarAmigo, agregarAmigo, getPublicacionAmigo, listadoAmigos, listadoDesconocidos, rechazarAmigo, solicitudAmistad} from "../controllers/amigo.controller.js"

const router = Router();

router.get("/listar-desconocidos", listadoDesconocidos)
router.get("/listar-amigos", listadoAmigos)
router.get("/solicitudes-amistad", solicitudAmistad)
router.get("/rechazar-amistad/:solicitud", rechazarAmigo)
router.get("/aceptar-amistad/:solicitud", aceptarAmigo)
router.get("/publicaciones-amigos", getPublicacionAmigo)

router.post("/agregar-amigo", agregarAmigo)

export default router;
