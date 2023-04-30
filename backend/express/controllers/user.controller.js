import config from "config"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import axios from "axios"
import jwtDecode from "jwt-decode"
import { PrismaClient } from '@prisma/client'

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
        about: true
      }
    })

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
    const { id } = req.auth

    await prisma.user.update({
      where: {
        id: id
      },
      data: {
        ...req.body
      }
    })

    res.status(200).json({ message: "Інформація оновлена"})
  }
  catch(err) {
    console.log(error)
    res.status(500).json({})
  }
}