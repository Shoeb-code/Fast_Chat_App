import { useEffect } from 'react'
import socket from '../services/socket'

export const useSocketChat = ({userId,onReceiveMessage,onOnlineUsers}) => {
  useEffect(() => {
    if (!userId) return

    socket.connect()

    socket.emit('join_chat',userId)

    socket.on('receive_message',onReceiveMessage)

    socket.on('online_users',onOnlineUsers)

    return () => {
      socket.off('receive_message')
      socket.off('online_users')
    }
  }, [userId])

  const sendMessage = (payload) => {
    console.log("SOCKET EMIT:",payload);
    socket.emit("send_message",payload);
  };

  return { sendMessage }
}