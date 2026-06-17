import express from "express";
import type { Application } from "express";
import authRouter from "./routes/auth.routes";
import propertyRouter from "./routes/property.routes";
import documentRouter from "./routes/document.routes";
import profileRouter from "./routes/profile.routes";
import cors from "cors";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Middlewares
app.use(express.json());

// Router
app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/documents", documentRouter);
app.use("/api/profiles", profileRouter);

export default app;
