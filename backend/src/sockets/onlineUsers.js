const onlineUsers = new Map()

export const addOnlineUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId)
}

export const removeOnlineUser = (socketId) => {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId)
      break
    }
  }
}

export const getUserSocket = (userId) => {
  return onlineUsers.get(userId)
}

export const getAllOnlineUsers = () => {
  return [...onlineUsers.keys()]
}