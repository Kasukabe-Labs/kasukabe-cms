import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import dotenv from "dotenv";
import connectDB from "./config/db";
import PromptRouter from "./routes/promptRouter";
import AuthRouter from "./routes/authRouter";
import { ImageRouter } from "./routes/uploadRouter";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to kasukabe cms server",
    status: "success",
  });
});

//prompt routes
app.use("/api/prompt", PromptRouter);

//auth routes
app.use("/api/auth", AuthRouter);

//upload routes
app.use("/api", ImageRouter);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
