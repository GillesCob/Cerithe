import type { Request, Response } from "express";
import { deleteUser } from "../services/user.service";

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    await deleteUser(userId);
    // Meme raisonnement que logoutController : token stateless, retirer le cookie suffit.
    res.clearCookie("refreshToken");
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème rencontré lors de la suppression du compte";
    return res.status(500).json({ message });
  }
};
