import { Router } from "express";
import { restoreController } from "../controllers/restore.controller.js";
import { validateParams } from "../middleware/paramsAuth.js";

const restoreRouter = Router()

restoreRouter.get('/restorepass/:tid', validateParams, restoreController.restore)

restoreRouter.post('/restorepass/:tid', restoreController.ChangePass)

restoreRouter.post('/restorepass', restoreController.jwtcode)

export default restoreRouter
