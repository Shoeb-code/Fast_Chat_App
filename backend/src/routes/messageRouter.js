import express from "express";
import { protectUser } from "../middleware/authMiddleware.js";
import { getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.get(
  "/messages"
  ,protectUser,
  getMessages
);

export default router;