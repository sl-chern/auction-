import app from './express/app.js'
import config from "config"
import { PrismaClient } from '@prisma/client'

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

	app.listen(PORT, async () => {
		console.log(`Express server started on port ${PORT}`)
	})
}

init()