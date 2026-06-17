import { validate } from "../middlewares/validate.middleware";
import { Router } from "express";
import { profileSchema } from "../validators/profile.validator";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import {
  createProfileController,
  deleteProfileController,
  readManyProfilesController,
  readOneProfileController,
  updateProfileController,
} from "../controllers/profile.controller";

const profileRouter = Router();

profileRouter.post("/", verifyAccessToken, validate(profileSchema), createProfileController);
profileRouter.get("/", verifyAccessToken, readManyProfilesController);
profileRouter.get("/:id", verifyAccessToken, readOneProfileController);
profileRouter.put("/:id", verifyAccessToken, updateProfileController);
profileRouter.delete("/:id", verifyAccessToken, deleteProfileController);

export default profileRouter;
