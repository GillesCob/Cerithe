import type { Request, Response } from "express";
import { createRooms, getRoomById, updateRoom, deleteRoom } from "../services/room.service";

export const createRoomsController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });
  const { propertyId, rooms } = req.body;

  try {
    const newRooms = await createRooms(userId, { propertyId, rooms });
    return res.status(201).json(newRooms);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de créer les pièces";
    return res.status(500).json({ message });
  }
};

export const readOneRoomController = async (req: Request, res: Response) => {
  const roomId = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    const room = await getRoomById(roomId, userId);
    return res.status(200).json(room);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pièce non trouvée";
    return res.status(500).json({ message });
  }
};

export const updateRoomController = async (req: Request, res: Response) => {
  const roomId = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });
  const { name, level, roomType, surface } = req.body;
  const data = { name, level, roomType, surface };

  try {
    const roomModified = await updateRoom(roomId, userId, data);
    return res.status(200).json(roomModified);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème lors de la mise à jour de la pièce";
    return res.status(500).json({ message });
  }
};

export const deleteRoomController = async (req: Request, res: Response) => {
  const roomId = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    await deleteRoom(roomId, userId);
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème lors de la suppression de la pièce";
    return res.status(500).json({ message });
  }
};
