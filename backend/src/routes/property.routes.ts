import { validate } from "../middlewares/validate.middleware";
import { Router } from "express";
import {
  createPropertyController,
  deletePropertyController,
  readManyPropertiesController,
  readOnePropertyController,
  updatePropertyController,
} from "../controllers/property.controller";
import { propertySchema } from "../validators/property.validator";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const propertyRouter = Router();

propertyRouter.post("/", verifyAccessToken, validate(propertySchema), createPropertyController);
propertyRouter.get("/", verifyAccessToken, readManyPropertiesController);
propertyRouter.get("/:id", verifyAccessToken, readOnePropertyController);
propertyRouter.put("/:id", verifyAccessToken, updatePropertyController);
propertyRouter.delete("/:id", verifyAccessToken, deletePropertyController);

export default propertyRouter;
