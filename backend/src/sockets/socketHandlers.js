import Message from "../models/Message.js";
import { addOnlineUser,removeOnlineUser,getUserSocket,getAllOnlineUsers,} from "./onlineUsers.js";

export const registerSocketHandlers = (io, socket) => {

  socket.on("join_chat", (userId) => {

    addOnlineUser(userId, socket.id);

    io.emit("online_users", getAllOnlineUsers());
  });

  socket.on("send_message", async (payload) => {

    try {
      const {senderId,receiverId,content} = payload;

 const savedMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
      });

      // send to receiver
      const receiverSocketId = getUserSocket(receiverId);

      if (receiverSocketId){
        io.to(receiverSocketId).emit("receive_message",savedMessage);
      }

      // send back confirmation to sender
      socket.emit( "message_sent",savedMessage);

    } 
    catch (error) {
      console.error("Socket message error:", error);}
    }
  );

  socket.on("disconnect", () => {
    removeOnlineUser(socket.id);

    io.emit("online_users", getAllOnlineUsers());
  
  });
};