import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
            id: true,
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
  
    res.status(200).json(lot)
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

    const conditions = []

    if(!!minPrice) {
      conditions.push({ currentPrice: { gte: minPrice }})
    }

    if(!!maxPrice) {
      conditions.push({ currentPrice: { lte: maxPrice }})
    }

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
        startPrice: true,
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

export const createLot = async (req, res, next) => {
  try {
    const { id: userId } = req.auth

    const {
      paymentTypes,
      deliveryTypes,
      dealTypes,
      shippingPayment,
      endDate,
      startDate,
      reservePrice,
      autoConfirmOfferPrice,
      minOfferPrice,
      buyNowPrice,
      betStep,
      startPrice,
      subcategory,
      location,
      description,
      condition,
      name,
      allowOffers,
      betHistory,
      reList
    } = req.body

    const lot = await prisma.lot.create({
      data: {
        name: name,
        description: description,
        condition: condition,
        startPrice: +startPrice,
        betStep: +betStep || null,
        betHistory: betHistory !== 'true',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        buyNowPrice: +buyNowPrice || null,
        reservePrice: +reservePrice || null,
        relist: reList === 'true',
        allowOffers: allowOffers === 'true',
        minOfferPrice: +minOfferPrice || null,
        autoConfirmOfferPrice: +autoConfirmOfferPrice || null,
        location: location,
        shippingPayment: shippingPayment,
        category: {
          connect: {
            id: +subcategory
          }
        },
        user: {
          connect: {
            id: +userId
          }
        }
      }
    })

    await prisma.image.createMany({
      data: req.files.image.map(item => ({
        path: item.path.slice(7),
        lotId: lot.id
      }))
    })

    await prisma.paymentTypeList.createMany({
      data: JSON.parse(paymentTypes).map(item => ({
        lotId: lot.id,
        paymentTypeId: +item
      }))
    })

    await prisma.deliveryTypeList.createMany({
      data: JSON.parse(deliveryTypes).map(item => ({
        lotId: lot.id,
        deliveryTypeId: +item
      }))
    })

    await prisma.dealTypeList.createMany({
      data: JSON.parse(dealTypes).map(item => ({
        lotId: lot.id,
        dealTypeId: +item
      }))
    })

    const features = await prisma.feature.findMany({
      where: {
        categoryId: +subcategory
      }
    })

    await prisma.featureValue.createMany({
      data: features.map(item => ({
        lotId: lot.id,
        featureId: item.id,
        featureOptionId: item.isOptions ? +req.body[`feature${item.id}`] : null,
        value: item.isOptions ? null : +req.body[`feature${item.id}`],
      }))
    })

    res.status(201).json({ message: "Лот був створений" })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const updateLot = async (req, res, next) => {
  try {
    const { id: userId } = req.auth
    const { id: lotId } = req.params

    const lotWithUserId = await prisma.lot.findFirst({
      where: {
        id: +lotId
      }
    })

    if(lotWithUserId.userId !== +userId)
      return res.status(403).json({message: "Ви не можете редагувати не власний лот"})
    
    if(lotWithUserId.startDate < new Date())
      return res.status(400).json({message: "Ви не можете редагувати лот після початку торгів"})

    const {
      paymentTypes,
      deliveryTypes,
      dealTypes,
      shippingPayment,
      endDate,
      startDate,
      reservePrice,
      autoConfirmOfferPrice,
      minOfferPrice,
      buyNowPrice,
      betStep,
      startPrice,
      subcategory,
      location,
      description,
      condition,
      name,
      allowOffers,
      betHistory,
      reList,
      deletedImages
    } = req.body

    const deleted = await prisma.image.findMany({
      where: {
        id: {
          in: JSON.parse(deletedImages)
        }
      }
    })

    deleted.forEach(item => {
      fs.rm(`${__dirname}/../../images/${item.path}`, (err) => {
        if(err)
          console.error(err.message)
        return
      })
    })
    
    await prisma.image.deleteMany({
      where: {
        id: {
          in: JSON.parse(deletedImages)
        }
      }
    })

    await prisma.deliveryTypeList.deleteMany({
      where: {
        lotId: +lotId
      }
    })

    await prisma.dealTypeList.deleteMany({
      where: {
        lotId: +lotId
      }
    })

    await prisma.paymentTypeList.deleteMany({
      where: {
        lotId: +lotId
      }
    })

    await prisma.featureValue.deleteMany({
      where: {
        lotId: +lotId
      }
    })

    const lot = await prisma.lot.update({
      where: {
        id: +lotId
      },
      data: {
        name: name,
        description: description,
        condition: condition,
        startPrice: +startPrice,
        betStep: +betStep || null,
        betHistory: betHistory !== 'true',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        buyNowPrice: +buyNowPrice || null,
        reservePrice: +reservePrice || null,
        relist: reList === 'true',
        allowOffers: allowOffers === 'true',
        minOfferPrice: +minOfferPrice || null,
        autoConfirmOfferPrice: +autoConfirmOfferPrice || null,
        location: location,
        shippingPayment: shippingPayment,
        category: {
          connect: {
            id: +subcategory
          }
        }
      }
    })

    if(!!req.files.image)
      await prisma.image.createMany({
        data: req.files.image.map(item => ({
          path: item.path.slice(7),
          lotId: lot.id
        }))
      })

    await prisma.paymentTypeList.createMany({
      data: JSON.parse(paymentTypes).map(item => ({
        lotId: lot.id,
        paymentTypeId: +item
      }))
    })

    await prisma.deliveryTypeList.createMany({
      data: JSON.parse(deliveryTypes).map(item => ({
        lotId: lot.id,
        deliveryTypeId: +item
      }))
    })

    await prisma.dealTypeList.createMany({
      data: JSON.parse(dealTypes).map(item => ({
        lotId: lot.id,
        dealTypeId: +item
      }))
    })

    const features = await prisma.feature.findMany({
      where: {
        categoryId: +subcategory
      }
    })

    await prisma.featureValue.createMany({
      data: features.map(item => ({
        lotId: lot.id,
        featureId: item.id,
        featureOptionId: item.isOptions ? +req.body[`feature${item.id}`] : null,
        value: item.isOptions ? null : +req.body[`feature${item.id}`],
      }))
    })

    res.status(200).json({ message: "Інформаця про лот була оновлена" })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getAllAmounts = async (req, res, next) => {
  try {
    const { id: userId } = req.auth

    const lotsAmount = await prisma.lot.aggregate({
      where: {
        userId: +userId
      },
      _count: true
    })

    const futureLots = await prisma.lot.aggregate({
      where: {
        AND: [
          { userId: +userId},
          { startDate: { gte: new Date() } }
        ]
      },
      _count: true
    })

    const activeLots = await prisma.lot.aggregate({
      where: {
        AND: [
          { userId: +userId},
          { startDate: { lte: new Date() }},
          { endDate: { gte: new Date() }}
        ]
      },
      _count: true
    })

    const soldLots = await prisma.lot.aggregate({
      where: {
        AND: [
          { userId: +userId},
          { endDate: { lte: new Date() }},
          { orders: { none: {} }}
        ]
      },
      _count: true
    })

    const orderedLots = await prisma.lot.aggregate({
      where: {
        AND: [
          { userId: +userId},
          { endDate: { lte: new Date() }},
          { orders: { some: {} }}
        ]
      },
      _count: true
    })

    const activeAuctions = await prisma.lot.aggregate({
      where: {
        AND: [
          { bets: { some: { userId: +userId }}},
          { startDate: { lte: new Date() }},
          { endDate: { gte: new Date() }}
        ]
      },
      _count: true
    })

    const ordered = await prisma.lot.aggregate({
      where: {
        AND: [
          { endDate: { lte: new Date() }},
          { orders: { some: { userId: +userId }}}
        ]
      },
      _count: true
    })

    let buyed = await prisma.lot.findMany({
      select: {
        bets: {
          select: {
            price: true,
            userId: true,
          },
          orderBy: {
            price: 'desc',
          },
          take: 1
        },
      },
      where: {
        AND: [
          { endDate: { lte: new Date() }},
          { orders: { none: {} }}
        ]
      },
    })

    buyed = buyed.filter(item => item.bets[0]?.userId === +userId)

    res.status(200).json({ 
      allAmount: lotsAmount._count,
      futureAmount: futureLots._count,
      activeAmount: activeLots._count,
      soldAmount: soldLots._count,
      orderedLotsAmount: orderedLots._count,
      activeAuctionsAmount: activeAuctions._count,
      orderedAmount: ordered._count,
      buyedAmount: buyed.length
    })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getAllLots = async (req, res, next) => {
  try {
    const { skip, take, sort, desc } = req.body
    const { id: userId } = req.auth

    const order = {}

    const { flag } = req.params
    const condition = []

    console.log(+userId)
    
    switch(flag) {
      case 'alllots': 
        condition.push({ userId: +userId })
        break
      case 'futurelots':
        condition.push({ userId: +userId })
        condition.push({ startDate: { gte: new Date() } })
        break
      case 'activelots':
        condition.push({ userId: +userId })
        condition.push({ startDate: { lte: new Date() }})
        condition.push({ endDate: { gte: new Date() }})
        break
      case 'soldlots' :
        condition.push({ userId: +userId })
        condition.push({ endDate: { lte: new Date() }})
        condition.push({ orders: { none: {} }})
        break
      case 'orderedlots': 
        condition.push({ userId: +userId })
        condition.push({ endDate: { lte: new Date() }})
        condition.push({ orders: { some: {} }})
        break
      case 'activeauctions':
        condition.push({ bets: { some: { userId: +userId }}})
        condition.push({ startDate: { lte: new Date() }})
        condition.push({ endDate: { gte: new Date() }})
        break
      case 'buyed':
        condition.push({ endDate: { lte: new Date() }})
        condition.push({ orders: { none: {} }})
        break
      case 'ordered':
        condition.push({ endDate: { lte: new Date() }})
        condition.push({ orders: { some: { userId: +userId }}})
        break
    }

    switch(sort?.value) {
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

    let lots = await prisma.lot.findMany({
      where: {
        AND: [
          ...condition,
        ]
      },
      select: {
        id: true,
        name: true,
        currentPrice: true,
        startPrice: true,
        endDate: true,
        images: {
          select: {
            path: true
          },
          take: 1
        },
        bets: {
          select: {
            price: true,
            userId: true,
          },
          orderBy: {
            price: 'desc',
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
      take: take,
      skip: skip
    })

    if(flag === 'buyed') {
      lots = lots.filter(item => item.bets[0]?.userId === +userId)
    }

    res.status(200).json(lots)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getAllUserCurrentLotsAmount = async (req, res, next) => {
  try {
    const { id: userId } = req.params

    let lots = await prisma.lot.aggregate({
      where: {
        AND: [
          { userId: +userId },
          { startDate: { lte: new Date() }},
          { endDate: { gte: new Date() }}
        ]
      },
      _count: true
    })

    res.status(200).json({amount: lots._count})
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getAllUserCurrentLots = async (req, res, next) => {
  try {
    const { skip, take, sort, desc } = req.body
    const { id: userId } = req.params

    const order = {}

    switch(sort?.value) {
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

    let lots = await prisma.lot.findMany({
      where: {
        AND: [
          { userId: +userId },
          { startDate: { lte: new Date() }},
          { endDate: { gte: new Date() }}
        ]
      },
      select: {
        id: true,
        name: true,
        currentPrice: true,
        startPrice: true,
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
      take: take,
      skip: skip
    })

    res.status(200).json(lots)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getLotsBuyedFromUser = async (req, res, next) => {
  try {
    const { id: sellerId } = req.params
    const { id: buyerId } = req.auth

    const lots = await prisma.lot.findMany({
      where: {
        userId: +sellerId,
        orders: {
          some: {
            userId: +buyerId,
          }
        },
        reviews: {
          none: {
            sellerId: +sellerId,
            buyerId: +buyerId,
          }
        }
      },
      select: {
        id: true,
        name: true,
        currentPrice: true,
        images: {
          select: {
            path: true,
          },
          take: 1
        }
      }
    })

    res.status(200).json(lots)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}