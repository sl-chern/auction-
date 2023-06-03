import { Router } from "express"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import { createOrder, getLotInfoForCHeckout, getWins } from "../controllers/order.controller.js"
import userPermission from "../middlewares/userPermission.middleware.js"
import Joi from "joi"
import { createValidator } from 'express-joi-validation'

const validator = createValidator()

const router = Router()

const orderSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(40).regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/),
  lastName: Joi.string().required().min(2).max(40).regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/),
  address: Joi.string().required().regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ0-9.,]+$/),
  city: Joi.string().required().min(2).max(40).regex(/^[a-zA-Zа-яА-ЯіІїЇєЄ]+$/),
  phone: Joi.string().required().length(13).regex(/^[+0-9]+$/),
  dealType: Joi.number().required(),
  deliveryType: Joi.number().required(),
  paymentType: Joi.number().required()
})

router.get("/wins/:id", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), userPermission, getWins)
router.get("/lot/:id", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), getLotInfoForCHeckout)
router.post("/lot/:id", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), validator.body(orderSchema), createOrder)

export default router