import { Router } from "express"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import multer from "multer"
import { v4 as uuid } from "uuid"
import { authenticate, refresh, logout, getUser, patchUser, getReviews, createReview } from "../controllers/user.controller.js"
import userPermission from "../middlewares/userPermission.middleware.js"

const storage = multer.diskStorage(
  {
    destination: "images/users/",
    filename: ( req, file, callback ) => {
      callback(null, `${uuid()}.jpg`)
    }
  }
)

const upload = multer({storage: storage})

const router = Router()

router.post("/authenticate", authenticate)
router.post("/logout", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), logout)
router.post("/refresh", refresh)
router.route("/:id")
  .get(getUser)
  .patch(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), userPermission, upload.single("image"), patchUser)
  .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}))

router.post("/:id/reviews", getReviews)
router.post("/review", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), createReview)

export default router