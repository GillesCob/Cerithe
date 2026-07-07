import { validate } from "../middlewares/validate.middleware";
import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import { transmissionchema, selectRecipientProfileSchema } from "../validators/transmission.validator";
import {
  createTransmissionUrl,
  readOneTransmissionController,
  selectRecipientProfileController,
  acceptTransmissionController,
  cancelTransmissionController,
  confirmTransmissionController,
} from "../controllers/transmission.controller";

const transmissionRouter = Router();

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
