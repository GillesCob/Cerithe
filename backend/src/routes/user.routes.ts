import { Router } from "express";
import { verifyAccessToken } from "../middlewares/auth.middleware";
import { deleteUserController } from "../controllers/user.controller";

const userRouter = Router();

userRouter.delete("/me", verifyAccessToken, deleteUserController);

export default userRouter;
