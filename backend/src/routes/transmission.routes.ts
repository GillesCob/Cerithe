import { validate } from "../middlewares/validate.middleware";
import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import { transmissionchema, selectRecipientProfileSchema } from "../validators/transmission.validator";
import {
  createTransmissionUrl,
  readOneTransmissionController,
  getLatestTransmissionController,
  selectRecipientProfileController,
  acceptTransmissionController,
  cancelTransmissionController,
  confirmTransmissionController,
} from "../controllers/transmission.controller";

const transmissionRouter = Router();

// Route fixe "/property/:propertyId" déclarée avant "/:token" pour ne pas être interprétée comme un token.
transmissionRouter.get("/property/:propertyId", verifyAccessToken, getLatestTransmissionController);
transmissionRouter.post("/:propertyId", verifyAccessToken, validate(transmissionchema), createTransmissionUrl);
transmissionRouter.get("/:token", verifyAccessToken, readOneTransmissionController);
transmissionRouter.post(
  "/:token/profile",
  verifyAccessToken,
  validate(selectRecipientProfileSchema),
  selectRecipientProfileController,
);
transmissionRouter.post("/:token/accept", verifyAccessToken, acceptTransmissionController);
transmissionRouter.post("/:token/cancel", verifyAccessToken, cancelTransmissionController);
transmissionRouter.post("/:token/confirm", verifyAccessToken, confirmTransmissionController);

export default transmissionRouter;
