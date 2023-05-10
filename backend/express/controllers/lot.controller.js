import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient({
  log: ["query"]
})

const exclude = (obj, keys) => {
  for (let key of keys) {
    delete obj[key]
  }
  return obj
}

export const getLot = async (req, res, next) => {
  try {
    const { id } = req.params

    const lot = await prisma.lot.findFirst({
      where: {
        id: +id
      },
      include: {
        images: {
          select: {
            path: true
          }
        },
        featureValue: {
          select: {
            value: true,
            feature: {
              select: {
                name: true
              }
            }
          }
        },
        dealTypeList: {
          select: {
            dealType: {
              select: {
                name: true
              }
            }
          }
        },
        deliveryTypeList: {
          select: {
            deliveryType: {
              select: {
                name: true
              }
            }
          }
        },
        paymentTypeList: {
          select: {
            paymentType: {
              select: {
                name: true
              }
            }
          }
        },
        category: {
          select: {
            name: true,
            category: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        },
        offers: {
          select: {
            price: true
          },
          orderBy: {
            price: 'desc'
          },
          take: 1,
        }
      }
    })

    const lotWithoutData = exclude(lot, ['buyNowPrice', 'reservePrice', 'relist', 'autoConfirmOfferPrice', 'userId'])
  
    res.status(200).json(lotWithoutData)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getBets = async (req, res, next) => {
  try {
    const { id } = req.params

    const lot = await prisma.lot.findFirst({
      where: {
        id: +id
      },
      select: {
        betHistory: true
      }
    })

    const bets = await prisma.bet.findMany({
      where: {
        lotId: +id
      },
      select: {
        date: true,
        price: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        price: "desc"
      }
    })

    const data = {
      amount: bets.length,
      bets: lot.betHistory ? bets : null
    }
  
    res.status(200).json(data)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getOffers = async (req, res, next) => {
  try {
    const { id: lotId } = req.params
    const { id: userId } = req.auth

    let data

    const lot = await prisma.lot.findFirst({
      where: {
        id: +lotId
      }
    })

    if(lot.userId === +userId) {
      data = await prisma.offer.findMany({
        where: {
          lotId: lot.id
        },
        select: {
          status: true,
          price: true,
          id: true,
          date: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              image: true
            }
          }
        }
      })
    }
    else {
      data = await prisma.offer.findMany({
        where: {
          userId: +userId
        }
      })
    }
  
    res.status(200).json(data)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}