import { Router } from "express";
import passport from "passport";
import { ChatController } from "../controllers/Chat.controller.js";

const ChatRouter = Router()

ChatRouter.get("/mensajes", ChatController.Chats)

ChatRouter.post('/', passport.authenticate('jwt', { session: false }), ChatController.Envio)

export default ChatRouter;
