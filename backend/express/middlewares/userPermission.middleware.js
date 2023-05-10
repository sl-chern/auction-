const userPermission = async (req, res, next) => {
  try {
    if(+req.params.id !== +req.auth.id)
      return res.status(403).json({message: "Немає доступу"})
    
    next()
  }
  catch(err) {
    console.log(err)
    res.status(500).json({})
  }
}

export default userPermission