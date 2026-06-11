import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginController, registerController } from "../controllers/auth.controller";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerController);
authRouter.post("/login", validate(loginSchema), loginController);

export default authRouter;
