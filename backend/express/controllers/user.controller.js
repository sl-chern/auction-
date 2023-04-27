import config from "config"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import axios from "axios"
import jwtDecode from "jwt-decode"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({log: ["query"]})

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

    const refreshToken = await prisma.refreshToken.upsert({
      where: {
        userId: user.id,
        deviceId: deviceId
      },
      update: {
        endDate: endDate,
        token: newRefreshToken
      },
      create: {
        userId: user.id,
        endDate: endDate,
        token: newRefreshToken,
        deviceId: deviceId
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

    const userInfo = {
      access_token: accessToken,
      refresh_token: refreshToken,
      user_info: {
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

    prisma.refreshToken.delete({
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

    const newRefreshToken = await prisma.refreshToken.update({
      where: {
        deviceId: deviceId,
        refreshToken: refreshToken,
        endDate: {
          lte: new Date()
        }
      },
      data: {
        refreshToken: token,
        endDate: endDate
      }
    })

    await prisma.refreshToken.deleteMany({
      where: {
        deviceId: deviceId,
        id: {
          notIn: [newRefreshToken?.id || null],
        }
      }
    })

    if(newRefreshToken === null)
      return res.status(401).json({})
    
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
      access_token: accessToken,
      refresh_token: refreshToken,
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
        id: req.params.id,
      },
      select: {
        id,
        image,
        firstName,
        lastName,
        phone,
        email,
        login,
        role
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