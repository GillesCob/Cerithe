import express from "express";
import type { Application } from "express";

const app: Application = express();

// Middlewares
app.use(express.json());

export default app;
