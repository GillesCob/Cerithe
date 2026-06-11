import express from "express";
import type { Application } from "express";
import authRouter from "./routes/auth.routes";

const app: Application = express();

// Middlewares
app.use(express.json());

// Router
app.use("/api/auth", authRouter);

export default app;
