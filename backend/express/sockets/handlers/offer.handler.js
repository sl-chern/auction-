import { PrismaClient } from '@prisma/client'
import config from 'config'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient({
  log: ["query"]
})

const offerHandler = (io, socket) => {
  socket.on('createOffer', async (offer) => {
    const { lotId, price, accessToken } = offer

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
        !lot.allowOffers ||
        lot.minOfferPrice > +price ||
        lot.startDate > new Date() ||
        lot.endDate < new Date()
      )
        throw new Error(400)

      await prisma.offer.create({
        data: {
          price: price,
          date: new Date(),
          lot: { connect: { id: +lotId }},
          user: { connect: { id: +userId }},
          status: "NEW"
        },
      })
      
      io.to(lotId).emit("newOffer", { 
        message: "Пропозиція була створена"
      })
    }
    catch(err) {
      io.to(lotId).emit("customError", { 
        error: err.message, 
        event: 'createBet',
        data: offer
      })
      console.log(err)
    }
  })

  socket.on('changeOfferStatus', async body => {
    const { id, status, accessToken } = body
    let lotId

    try {
      let userId

      const offer = await prisma.offer.findFirst({
        where: {
          id: +id
        }
      })

      const lot = await prisma.lot.findFirst({
        where: {
          id: offer.lotId
        }
      })

      lotId = lot.id

      jwt.verify(accessToken, config.get('jwtsecret'), (err, decoded) => {
        if(err) {
          throw new Error(401)
        }
        userId = decoded.id
      })

      const offers = await prisma.offer.findMany({
        where: {
          lotId
        }
      })

      if(
        !lot.allowOffers ||
        lot.userId !== +userId ||
        lot.startDate > new Date() ||
        lot.endDate < new Date() ||
        offer.status !== "NEW" ||
        offers.filter(item => item.status === "CONFIRMED").length !== 0
      )
        throw new Error(400)

      await prisma.offer.update({
        where: {
          id: +id
        },
        data: {
          status
        }
      })

      if(status === "CONFIRMED")
        await prisma.offer.updateMany({
          where: {
            lotId,
            status: {
              notIn: ["CONFIRMED", "REJECTED"]
            }
          },
          data: {
            status: "REJECTED"
          }
        })

      io.to(lotId.toString()).emit("changedOfferStatus", { 
        message: "Статус пропозиції змінений"
      })
    }
    catch(err) {
      io.to(lotId).emit("customError", { 
        error: err.message, 
        event: 'changeOfferStatus',
        data: body
      })
      console.log(err)
    }
  })
}

export default offerHandler