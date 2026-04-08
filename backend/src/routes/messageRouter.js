
import express from "express"


import { protectUser } from "../middleware/authMiddleware.js";
import { getMessages, markMessagesAsSeen, sendMessage } from "../controllers/messageController.js";

 export const messageRouter =express.Router();

messageRouter.post(
    "/send",
    protectUser,
    sendMessage
  );
  
  messageRouter.get(
    "/:userId",
    protectUser,
    getMessages
  );

  messageRouter.put(
    "/seen/:senderId",
    protectUser,
    markMessagesAsSeen
  )