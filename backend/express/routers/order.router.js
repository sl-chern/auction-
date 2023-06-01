import { Router } from "express"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import { getWins } from "../controllers/order.controller.js"
import userPermission from "../middlewares/userPermission.middleware.js"

const router = Router()

router.get("/wins/:id", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), userPermission, getWins)

export default router