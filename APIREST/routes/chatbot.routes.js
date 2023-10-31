import { Router } from "express";
import { Chatbot, aviso } from "../services/chatbot.service.js";
const router = Router();

router.post("/Chatbot", Chatbot);
router.post("/Chatbot/aviso", aviso);

export default router;
