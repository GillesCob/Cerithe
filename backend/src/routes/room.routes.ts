import { validate } from "../middlewares/validate.middleware";
import { Router } from "express";
import {
  createRoomsController,
  readOneRoomController,
  updateRoomController,
  deleteRoomController,
} from "../controllers/room.controller";
import { createRoomsSchema, updateRoomSchema } from "../validators/room.validator";
import { verifyAccessToken } from "../middlewares/auth.middleware";

const roomRouter = Router();

roomRouter.post("/", verifyAccessToken, validate(createRoomsSchema), createRoomsController);
roomRouter.get("/:id", verifyAccessToken, readOneRoomController);
roomRouter.patch("/:id", verifyAccessToken, validate(updateRoomSchema), updateRoomController);
roomRouter.delete("/:id", verifyAccessToken, deleteRoomController);

export default roomRouter;
