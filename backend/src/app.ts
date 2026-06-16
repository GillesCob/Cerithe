import express from "express";
import type { Application } from "express";
import authRouter from "./routes/auth.routes";
import propertyRouter from "./routes/property.routes";

const app: Application = express();

// Middlewares
app.use(express.json());

// Router
app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRouter);

export default app;
