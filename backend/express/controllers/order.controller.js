import { PrismaClient, Prisma } from '@prisma/client'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient({
  log: ["query"]
})

export const getWins = async (req, res, next) => {
  try {
    const { id: userId } = req.params

    const winsBet = await prisma.$queryRaw(
      Prisma.sql`
        SELECT lot.id, lot.\`name\`, image.\`path\`, a.userId, a.price, \`user\`.id userId, \`user\`.firstName, \`user\`.lastName
        FROM bet a
        INNER JOIN (
            SELECT lotId, MAX(price) price
          FROM bet
          GROUP BY lotId
        ) b ON a.lotId = b.lotId AND a.price = b.price
        LEFT JOIN lot ON a.lotId = lot.id
        LEFT JOIN \`user\` ON lot.userId = \`user\`.id
        LEFT JOIN image ON lot.id = image.lotId AND image.id IN (SELECT MIN(id) FROM image GROUP BY lotId)
        WHERE NOT EXISTS (SELECT id FROM \`order\` WHERE \`order\`.lotId = lot.id) AND a.userId = ${+userId}
      `
    )

    const winsOffer = await prisma.lot.findMany({
      where: {
        offers: {
          some: {
            status: 'CONFIRMED',
            userId: +userId
          }
        },
        orders: { none: { id: undefined }}
      },
      select: {
        id: true,
        name: true,
        endDate: true,
        offers: {
          select: {
            userId: true,
            price: true,
            status: true
          },
          where: {
            status: 'CONFIRMED',
            userId: +userId
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        images: {
          select: {
            path: true
          },
          take: 1
        },
      }
    })

    const result = [
      ...winsBet, 
      ...winsOffer.map(item => ({ 
        id: item.id, 
        name: item.name, 
        endDate: item.endDate,
        path: item.images[0] ? item.images[0]?.path: null,
        ...item.offers[0],
        userId: item.user.id,
        firstName: item.user.firstName,
        lastName: item.user.lastName,
      }))
    ].sort((a, b) => {
      if(a.endDate < b.endDate) return -1
      if(a.endDate > b.endDate) return 1
      return 0
    })
  
    res.status(200).json(result)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}