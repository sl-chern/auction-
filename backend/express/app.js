import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('images'))

export default app