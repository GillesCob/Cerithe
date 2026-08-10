import express from "express";
import type { Application } from "express";
import authRouter from "./routes/auth.routes";
import propertyRouter from "./routes/property.routes";
import documentRouter from "./routes/document.routes";
import profileRouter from "./routes/profile.routes";
import userRouter from "./routes/user.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import transmissionRouter from "./routes/transmission.routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Router
app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/documents", documentRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/users", userRouter);
app.use("/api/transmissions", transmissionRouter);

export default app;
