import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator";
import {
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller";
import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerController);
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.post("/refresh", refreshController);
authRouter.post("/logout", logoutController);
authRouter.post("/forgot-password", validate(forgotPasswordSchema), forgotPasswordController);
authRouter.post("/reset-password", validate(resetPasswordSchema), resetPasswordController);
authRouter.get("/me", verifyAccessToken, meController);

export default authRouter;
