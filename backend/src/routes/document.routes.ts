import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import {
  createDocumentController,
  getDocumentsByPropertyController,
  getDocumentsByRoomController,
  downloadDocumentController,
  deleteDocumentController,
} from "../controllers/document.controller";
import { uploadSingleDocument } from "../middlewares/upload.middleware";

const documentRouter = Router();

documentRouter.post("/", verifyAccessToken, uploadSingleDocument, createDocumentController);
// Route dediee (pas une generalisation de /:propertyId) : decision du 13/08, cf suivi.html.
documentRouter.get("/room/:roomId", verifyAccessToken, getDocumentsByRoomController);
documentRouter.get("/:propertyId", verifyAccessToken, getDocumentsByPropertyController);
documentRouter.get("/:id/download", verifyAccessToken, downloadDocumentController);
documentRouter.delete("/:id", verifyAccessToken, deleteDocumentController);

export default documentRouter;
