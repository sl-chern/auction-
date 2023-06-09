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

export const getLotInfoForCHeckout = async (req, res, next) => {
  try {
    const { id: userId } = req.auth
    const { id: lotId } = req.params

    const lot = await prisma.lot.findFirst({
      where: {
        id: +lotId
      },
      select: {
        id: true,
        name: true,
        currentPrice: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        },
        deliveryTypeList: {
          select: {
            deliveryType: {
              select: {
                id: true,
                name: true
              }
            },
          }
        },
        dealTypeList: {
          select: {
            dealType: {
              select: {
                id: true,
                name: true
              }
            },
          }
        },
        paymentTypeList: {
          select: {
            paymentType: {
              select: {
                id: true,
                name: true
              }
            },
          }
        },
        images: {
          select: {
            path: true
          },
          take: 1
        },
        bets: {
          select: {
            id: true,
            userId: true,
            price: true
          },
          orderBy: {
            price: 'desc'
          },
          take: 1
        },
        offers: {
          select: {
            id: true,
            price: true,
            userId: true
          },
          where: {
            status: 'CONFIRMED'
          }
        }
      }
    })

    if((!!lot.bets[0] && lot.bets[0]?.userId !== +userId) || (!!lot.offers[0] && lot.offers[0].userId !== +userId)) 
      return res.status(403).json({message: "Немає доступу"})

    res.status(200).json(lot)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const createOrder = async (req, res, next) => {
  try {
    const { id: userId } = req.auth
    const { id: lotId } = req.params
    const { city, address, firstName, lastName, phone, dealType, deliveryType, paymentType } = req.body

    const lot = await prisma.lot.findFirst({
      where: {
        id: +lotId
      },
      select: {
        id: true,
        bets: {
          select: {
            id: true,
            userId: true,
            price: true
          },
          orderBy: {
            price: 'desc'
          },
          take: 1
        }
      }
    })

    if(lot.bets[0].userId !== +userId) 
      return res.status(403).json({message: "Немає доступу"})

    const delivery = await prisma.delivery.create({
      data: {
        price: 0,
        city: city,
        address: address,
        deliveryType: {
          connect: {
            id: +deliveryType
          }
        }
      }
    })

    await prisma.order.create({
      data: {
        price: lot.bets[0].price + delivery.price,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        orderStatus: 'NEW',
        user: {
          connect: {
            id: +userId
          }
        },
        lot: {
          connect: {
            id: +lotId
          }
        },
        delivery: {
          connect: {
            id: delivery.id
          }
        },
        dealType: {
          connect: {
            id: +dealType
          }
        },
        paymentType: {
          connect: {
            id: +paymentType
          }
        }
      }
    })

    res.status(200).json({ message: "Замовлення, було оформлене" })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getOrders = async (req, res, next) => {
  try {
    const { id: userId } = req.auth
    const { flag } = req.params
    const { skip, take, sort, desc, statuses } = req.body

    const where = {}

    switch(flag) {
      case 'bought': 
        where.userId = +userId
        break
      case 'sold':
        where.lot = {
          userId: +userId
        }
        break
    }

    if(!!statuses && statuses.length > 0)
      where.orderStatus = {
        in: statuses
      }

    const order = {}

    switch(sort?.value) {
      case 'price': 
        order.currentPrice = desc ? 'desc' : 'asc'
        break 
      case 'date': 
        order.createdData = desc ? 'desc' : 'asc'
        break
    }

    const orders = await prisma.order.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdDate: true,
        phone: true,
        orderStatus: true,
        price: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        },
        dealType: {
          select: {
            name: true
          }
        },
        paymentType: {
          select: {
            name: true
          }
        },
        delivery: {
          select: {
            city: true,
            address: true,
            deliveryType: {
              select: {
                name: true,
              }
            }
          }
        },
        lot: {
          select: {
            id: true,
            name: true,
            currentPrice: true,
            images: {
              select: {
                path: true
              },
              take: 1
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: order,
      take,
      skip
    })

    res.status(200).json(orders)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getOrdersAmount = async (req, res, next) => {
  try {
    const { id: userId } = req.auth

    const boughtOrders = await prisma.order.aggregate({
      where: {
        userId: +userId
      },
      _count: true
    })

    const soldOrders = await prisma.order.aggregate({
      where: {
        lot: {
          userId: +userId
        }
      },
      _count: true
    })

    res.status(200).json({
      boughtAmount: boughtOrders._count,
      soldAmount: soldOrders._count
    })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const changeOrderStatus = async (req, res, next) => {
  try {
    const { id: orderId } = req.auth
    const { status } = req.body

    console.log(status, orderId);

    await prisma.order.update({
      where: {
        id: +orderId
      },
      data: {
        orderStatus: status
      }
    })

    res.status(200).json({ message: 'Статус був успішно оновлений' })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}