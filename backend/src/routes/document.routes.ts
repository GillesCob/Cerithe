import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import {
  createDocumentController,
  getDocumentsByPropertyController,
  deleteDocumentController,
} from "../controllers/document.controller";
import { uploadSingleDocument } from "../middlewares/upload.middleware";

const documentRouter = Router();

documentRouter.post("/", verifyAccessToken, uploadSingleDocument, createDocumentController);
documentRouter.get("/:propertyId", verifyAccessToken, getDocumentsByPropertyController);
documentRouter.delete("/:id", verifyAccessToken, deleteDocumentController);

export default documentRouter;
