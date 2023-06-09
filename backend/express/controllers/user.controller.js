import config from "config"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import axios from "axios"
import jwtDecode from "jwt-decode"
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient({
  log: ["query"]
})

export const authenticate = async (req, res, next) => {
  try {
    const { token, deviceId } = req.body

    const url = "https://www.googleapis.com/oauth2/v3/userinfo"

    const response = await axios.get(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const { family_name, given_name, email } = response.data

    let user = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {},
      create: {
        firstName: given_name,
        lastName: family_name,
        email: email
      }
    })

    const newRefreshToken = uuid()
    let endDate = new Date()
    endDate = new Date(endDate.setMonth(endDate.getMonth() + 1))

    let refreshToken = await prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        deviceId: deviceId
      },
      data: {
        endDate: endDate,
        token: newRefreshToken
      }
    })[0]

    if(refreshToken === undefined)
      refreshToken = await prisma.refreshToken.create({
        data: {
          user: { connect: {id: 1}},
          endDate: endDate,
          token: newRefreshToken,
          deviceId: deviceId
        },
      })

    const accessToken = jwt.sign(
      {
        name: user.firstName,
        id: user.id,
        role: user.role
      },
      config.get("jwtsecret"),
      {
        expiresIn: "1h"
      }
    )

    const userInfo = {
      accessToken: accessToken,
      refreshToken: refreshToken.token,
      userInfo: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        image: user.image === null ? null : `${config.get("baseUrl")}:${config.get("port")}/${user.image}`,
        roleId: user.role,
        login: user.login
      }
    }
  
    res.status(200).json(userInfo)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const logout = async (req, res) => {
  try {
    const { id } = req.auth
    const { deviceId } = req.body

    await prisma.refreshToken.deleteMany({
      where: {
        userId: id,
        deviceId: deviceId
      }
    })
  
    res.status(200).json()
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const refresh = async (req, res) => {
  try {
    const { deviceId, refreshToken } = req.body
    const token = uuid()
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + 1))

    const newRefreshToken = await prisma.refreshToken.updateMany({
      where: {
        deviceId: deviceId,
        token: refreshToken,
        endDate: {
          gte: new Date()
        }
      },
      data: {
        token: token,
        endDate: endDate
      }
    })
    
    if(newRefreshToken === null)
      return res.status(401).json({})

    console.log(newRefreshToken.id);

    await prisma.refreshToken.deleteMany({
      where: {
        deviceId: deviceId,
        id: {
          notIn: [newRefreshToken.id],
        }
      }
    })
    
    const user = await prisma.user.findFirst({
      where: {
        id: newRefreshToken.userId
      }
    })

    const accessToken = jwt.sign(
      {
        name: user.firstName,
        id: user.id,
        role: user.role
      },
      config.get("jwtsecret"),
      {
        expiresIn: "1h"
      }
    )

    res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    })
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const getUser = async (req, res) => {
  try {
    let user = await prisma.user.findFirst({
      where: {
        id: +req.params.id,
      },
      select: {
        id: true,
        image: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        login: true,
        role: true,
        about: true,
      }
    })

    let ordersAmount = await prisma.lot.aggregate({
      where: {
        AND: [
          { userId: user.id },
          { orders: { some: {}}}
        ]
      },
      _count: true
    })

    let reviewsAmount = await prisma.review.aggregate({
      where: {
        sellerId: user.id
      },
      _count: true
    })

    let positiveReviewAmount = await prisma.review.aggregate({
      where: {
        sellerId: user.id,
        recomendation: true
      },
      _count: true
    })

    console.log(reviewsAmount, positiveReviewAmount)

    
    user.amountOrders = ordersAmount._count
    user.positiveReviewAmount = positiveReviewAmount._count
    user.reviewsAmount = reviewsAmount._count

    user.image = user.image === null ? null : `${config.get("baseUrl")}:${config.get("port")}/${user.image}`

    res.status(200).json(user)
  }
  catch(error) {
    console.log(error)
    res.status(500).json({})
  }
}

export const patchUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findFirst({
      where: {
        id: +id
      },
      select: {
        image: true
      }
    })

    if(req.file?.path)
      fs.rm(`${__dirname}/../../images/${user.image}`, (err) => {
        if(err)
          console.error(err.message)
        return
      })

    await prisma.user.update({
      where: {
        id: +id
      },
      data: {
        ...req.body,
        image: req.file?.path.replace("images\\", "")
      }
    })

    res.status(200).json({ message: "Інформація оновлена"})
  }
  catch(err) {
    console.log(err)
    res.status(500).json({})
  }
}

export const createReview = async (req, res) => {
  try {
    const { id: buyerId } = req.auth
    const { id: sellerId, text, recomendation, lotId } = req.body

    await prisma.review.create({
      data: {
        recomendation: recomendation,
        sellerId: sellerId,
        buyerId: buyerId,
        text: text,
        lotId: +lotId
      }
    })

    res.status(200).json({ message: "Відгук створений"})
  }
  catch(err) {
    console.log(err)
    res.status(500).json({})
  }
}

export const getReviews = async (req, res) => {
  try {
    const { id: sellerId } = req.params
    const { desc, sort } = req.body

    const order = {}

    switch(sort?.value) {
      case 'date': 
        order.createdDate = desc ? 'desc' : 'asc'
        break 
      case 'recomendation': 
        order.recomendation = desc ? 'desc' : 'asc'
        break
    }

    const reviews = await prisma.review.findMany({
      where: {
        sellerId: +sellerId
      },
      select: {
        text: true,
        recomendation: true,
        createdDate: true,
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
            id: true
          }
        }
      },
      orderBy: order
    })

    res.status(200).json(reviews)
  }
  catch(err) {
    console.log(err)
    res.status(500).json({})
  }
}