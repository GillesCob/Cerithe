import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validators/auth.validator";
import { registerController } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
export default router;
