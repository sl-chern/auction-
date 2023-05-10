import { PrismaClient } from '@prisma/client'
import config from 'config'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient({
  log: ["query"]
})

const betHandler = (io, socket) => {
  socket.on('createBet', async (bet) => {
    const { lotId, price, accessToken } = bet

    try {
      let userId

      jwt.verify(accessToken, config.get('jwtsecret'), (err, decoded) => {
        if(err) {
          throw new Error(401)
        }
        userId = decoded.id
      })

      const lot = await prisma.lot.findFirst({
        where: {
          id: +lotId
        },
        include: {
          user: true
        }
      })

      if(lot.user.id === userId)
        throw new Error(403)

      if(
        lot.user.phone === null || 
        lot.currentPrice < price || 
        (lot.betStep !== null && lot.currentPrice + lot.betStep < price) ||
        lot.startDate > new Date() ||
        lot.endDate < new Date()
      )
        throw new Error(400)

      await prisma.bet.create({
        data: {
          price: price,
          date: new Date(),
          lot: { connect: { id: +lotId }},
          user: { connect: { id: +userId }}
        },
      })

      await prisma.lot.update({
        where: {
          id: +lotId,
        },
        data: {
          currentPrice: price
        }
      })

      io.to(lotId).emit("newBet", { 
        message: "Ставка була створена"
      })
    }
    catch(err) {
      io.to(lotId).emit("customError", { 
        error: err.message, 
        event: 'createBet',
        data: bet 
      })
      console.log(err)
    }
  })
}

export default betHandler