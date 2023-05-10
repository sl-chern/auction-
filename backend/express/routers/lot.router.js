import { Router } from "express"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import multer from "multer"
import { v4 as uuid } from "uuid"
import { getBets, getLot, getOffers } from "../controllers/lot.controller.js"

const storage = multer.diskStorage(
  {
    destination: "images/lots/",
    filename: ( req, file, callback ) => {
      callback(null, `${uuid()}.jpg`)
    }
  }
)

const upload = multer({storage: storage})

const router = Router()

router.route("/:id")
  .get(getLot)
  .patch(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), upload.single("image"))
  .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}))

router.get("/:id/bets", getBets)
router.get("/:id/offers", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), getOffers)

export default router