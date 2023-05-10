import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import userRouter from "./routers/user.router.js"
import lotRouter from "./routers/lot.router.js"

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('images'))

app.use("/api/user", userRouter)
app.use("/api/lot", lotRouter)

export default app