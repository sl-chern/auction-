import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ["query"]
})

const userPermission = async (req, res, next) => {
  try {
    if(req.baseUrl !== '/api/lot' && +req.params.id === +req.auth.id)
      return next()
      
    const lot = await prisma.lot.findFirst({
      where: {
        id: +req.params.id
      }
    })

    if(lot.userId === +req.auth.id)
      return next()

    res.status(403).json({message: "Немає доступу"})
  }
  catch(err) {
    console.log(err)
    res.status(500).json({})
  }
}

export default userPermission