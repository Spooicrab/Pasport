import { Router } from "express";
import { mockingController } from "../controllers/Mocking.controller.js";
const mockingRouter = Router()


mockingRouter.get('/', mockingController.mock)


export default mockingRouter