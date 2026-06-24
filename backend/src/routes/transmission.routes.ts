import { validate } from "../middlewares/validate.middleware";
import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import { transmissionchema } from "../validators/transmission.validator";
import { createTransmissionUrl } from "../controllers/transmission.controller";

const transmissionRouter = Router();

transmissionRouter.post("/:propertyId", verifyAccessToken, validate(transmissionchema), createTransmissionUrl);

export default transmissionRouter;
