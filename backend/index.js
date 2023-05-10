import app from './express/app.js'
import config from "config"
import { PrismaClient } from '@prisma/client'
import { Server } from 'socket.io'
import http from 'http'
import onConnection from './express/sockets/onConnection.js'

const server = http.createServer(app)

const io = new Server(server, {
	cors: "http://localhost:5173/"
})

const prisma = new PrismaClient()

const PORT = config.get("port") || 5000

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`)
	try {
		await prisma.$connect()
		console.log('Database connection OK!')
	} catch (error) {
		console.log('Unable to connect to the database:')
		console.log(error.message)
		process.exit(1)
	}
}

const init = async () => {
	await assertDatabaseConnectionOk()

	io.on("connection", socket => onConnection(io, socket))

	server.listen(PORT, async () => {
		console.log(`Express server started on port ${PORT}`)
	})
}

init()