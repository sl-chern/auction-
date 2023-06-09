import { Router } from "express"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import multer from "multer"
import { v4 as uuid } from "uuid"
import { getBets, getCategories, getSubcategoryFilters, getLot, getOffers, getLotFilters, getLots, createLot, updateLot, getAllLots, getAllAmounts, getAllUserCurrentLots, getAllUserCurrentLotsAmount } from "../controllers/lot.controller.js"
import userPermission from "../middlewares/userPermission.middleware.js"

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

router.get('/amounts', jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), getAllAmounts)
router.post('/alllots/:flag', jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), getAllLots)

router.post('/user/:id', getAllUserCurrentLots)
router.post('/user/:id/amount', getAllUserCurrentLotsAmount)

router.post("/categories", getCategories)
router.get("/categories/:id/filters", getSubcategoryFilters)
router.get("/filters", getLotFilters)

router.post('/lots', getLots)
router.post('/', jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), upload.fields([{ name: 'image' }]), createLot)

router.route("/:id")
  .get(getLot)
  .put(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), userPermission, upload.fields([{ name: 'image' }]), updateLot)
  .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}))

router.get("/:id/bets", getBets)
router.get("/:id/offers", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), getOffers)

export default router