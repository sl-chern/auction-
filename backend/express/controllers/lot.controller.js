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
            featureOption: {
              select: {
                value: true
              }
            },
            feature: {
              select: {
                name: true,
                unit: true,
                isOptions: true
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

export const getCategories = async (req, res, next) => {
  try {
    let { id } = req.body

    const categories = await prisma.category.findMany({
      where: {
        parentCategory: id
      },
      select: {
        id: true,
        name: true,
        parentCategory: true
      }
    })

    res.status(200).json(categories)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getSubcategoryFilters = async (req, res, next) => {
  try {
    let { id } = req.params

    const filters = await prisma.category.findFirst({
      where: {
        id: +id
      },
      select: {
        features: {
          select: {
            id: true,
            name: true,
            unit: true,
            isOptions: true,
            featureOptions: {
              select: {
                id: true,
                value: true
              }
            },
            featureRanges: {
              select: {
                id: true,
                min: true,
                max: true
              }
            }
          }
        }
      }
    })

    res.status(200).json(filters)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getLotFilters = async (req, res, next) => {
  try {
    const dealTypes = await prisma.dealType.findMany()
    const deliveryTypes = await prisma.deliveryType.findMany()
    const paymentTypes = await prisma.paymentType.findMany()

    res.status(200).json({
      dealTypes,
      deliveryTypes,
      paymentTypes
    })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getLots = async (req, res, next) => {
  try {
    const {
      category,
      subcategory,
      features,
      name,
      minPrice,
      maxPrice,
      newFor,
      endingIn,
      dealTypes,
      deliveryTypes,
      paymentTypes,
      offers,
      sort,
      desc,
      condition,
      skip,
      limit
    } = req.body

    const conditions = [
      { currentPrice: { gte: minPrice || -1, lte: maxPrice || 999999999999 } }
    ]

    if(!!subcategory) {
      conditions.push({ categoryId: +subcategory?.value })
    }
    else if(!!category) {
      conditions.push({ category: { parentCategory: +category?.value }})
    }

    if(!!name) {
      conditions.push({ name: { contains: name }})
    }

    if(!!offers) {
      console.log(offers.value)
      conditions.push({ allowOffers: offers.value })
    }

    if(!!newFor) {
      const filterDate = new Date(new Date().setSeconds(new Date().getSeconds() - newFor.value))
      conditions.push({ startDate: { gte: filterDate }})
    }

    if(!!endingIn) {
      console.log(endingIn)
      const filterDate = new Date(new Date().setSeconds(new Date().getSeconds() + endingIn.value))
      conditions.push({ endDate: { lte: filterDate }})
    }

    if(!!dealTypes) {
      conditions.push({ dealTypeList: { some: { dealTypeId: { in: dealTypes.map(item => +item.value)} }}})
    }
    
    if(!!deliveryTypes) {
      conditions.push({ deliveryTypeList: { some: { deliveryTypeId: { in: deliveryTypes.map(item => +item.value)} }}})
    }

    if(!!paymentTypes) {
      conditions.push({ paymentTypeList: { some: { paymentTypeId: { in: paymentTypes.map(item => +item.value)} }}})
    }

    if(!!condition) {
      conditions.push({ condition: { in: condition.map(item => item.value) }})
    }

    if(!!subcategory && !!features && Object.keys(features)?.length > 0) {
      const featuresFiltres = []

      for (const [key, value] of Object.entries(features)) {
        if(value instanceof Array) {
          const featureValue = { OR: [] }

          value.forEach(item => featureValue.OR.push({ featureValue: { some: { featureId: +key, featureOptionId: item.value }}}))

          featuresFiltres.push(featureValue)
        }
        else if(value instanceof Object) {
          const featureValue = { OR: [] }

          const ranges = await prisma.feature.findFirst({
            where: {
              id: +key,
            },
            select: {
              featureRanges: true
            }
          })

          Object.entries(value).forEach(([id]) => {
            const range = ranges.featureRanges.find(item => item.id === +id)
            featureValue.OR.push({ featureValue: { some: { featureId: +key, value: { gte: range.min || -1, lte: range.max || 999999999999.999 }}}})
          })

          featuresFiltres.push(featureValue)
        }
      }

      featuresFiltres.forEach(item => conditions.push(item))
    }

    const order = {}

    switch(sort) {
      case 'price': 
        order.currentPrice = desc ? 'desc' : 'asc'
        break 
      case 'ending': 
        order.endDate = desc ? 'desc' : 'asc'
        break
      case 'new': 
        order.startDate = desc ? 'desc' : 'asc'
        break
      case 'bets': 
        order.bets = {
          _count: desc ? 'desc' : 'asc'
        }
        break
    }

    const lots = await prisma.lot.findMany({
      where: {
        AND: [
          ...conditions,
          { startDate: { lte: new Date() }},
          { endDate: { gte: new Date() }}
        ]
      },
      select: {
        id: true,
        name: true,
        currentPrice: true,
        endDate: true,
        images: {
          select: {
            path: true
          },
          take: 1
        },
        _count: {
          select: {
            bets: true
          }
        }
        
      },
      orderBy: order,
      take: limit,
      skip: skip
    })

    const lotsCount = await prisma.lot.aggregate({
      where: {
        AND: [
          ...conditions,
          { startDate: { lte: new Date() }},
          { endDate: { gte: new Date() }}
        ]
      },
      _count: true
    })

    res.status(200).json({ lots, count: lotsCount._count })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}