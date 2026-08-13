import { validate } from "../middlewares/validate.middleware";
import { Router } from "express";
import {
  createPropertyController,
  deletePropertyController,
  readManyPropertiesController,
  readOnePropertyController,
  updatePropertyController,
  transferPropertyOwnerController,
} from "../controllers/property.controller";
import { propertySchema, updatePropertySchema, transferPropertyOwnerSchema } from "../validators/property.validator";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const propertyRouter = Router();

propertyRouter.post("/", verifyAccessToken, validate(propertySchema), createPropertyController);
propertyRouter.get("/", verifyAccessToken, readManyPropertiesController);
propertyRouter.get("/:id", verifyAccessToken, readOnePropertyController);
propertyRouter.put("/:id", verifyAccessToken, validate(updatePropertySchema), updatePropertyController);
propertyRouter.patch(
  "/:id/owner",
  verifyAccessToken,
  validate(transferPropertyOwnerSchema),
  transferPropertyOwnerController,
);
propertyRouter.delete("/:id", verifyAccessToken, deletePropertyController);

export default propertyRouter;
