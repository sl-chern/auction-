import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import userRouter from "./routers/user.router.js"

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('images'))

app.use("/api/user", userRouter)

export default app