import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import { authRouter } from "./routes/authRoutes.js";
import { messageRouter } from "./routes/messageRouter.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB();

app.use("/api/message",messageRouter);
app.use("/api/auth", authRouter);

export default app;