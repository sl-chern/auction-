import betHandler from "./handlers/bet.handler.js"
import offerHandler from "./handlers/offer.handler.js"

const onConnection = (io, socket) => {
  socket.on("forceDisconnect", () => socket.disconnect())
  socket.on("joinRoom", room => socket.join(room))

  betHandler(io, socket)
  offerHandler(io, socket)
}

export default onConnection