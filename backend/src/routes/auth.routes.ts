import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginController, meController, refreshController, registerController } from "../controllers/auth.controller";
import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), registerController);
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.post("/refresh", refreshController);
authRouter.get("/me", verifyAccessToken, meController);

export default authRouter;
