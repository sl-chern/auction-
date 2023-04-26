import { Router } from "express"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import multer from "multer"
import { v4 as uuid } from "uuid"

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

router.post("/authenticate")
router.post("/logout", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}))
router.post("/refresh")
router.route("/:id")
  .get()
  .patch(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), upload.single("image"))
  .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}))

export default router