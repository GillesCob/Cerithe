import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import { createDocumentController } from "../controllers/document.controller";
import { upload } from "../middlewares/upload.middleware";

const documentRouter = Router();

documentRouter.post("/", verifyAccessToken, upload.single("file"), createDocumentController);

export default documentRouter;
