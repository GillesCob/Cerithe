import type { Request, Response } from "express";
import { createTransmissionToken } from "../services/transmission.service";
import { allUserProfiles } from "../services/profile.service";

export const createTransmissionUrl = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.propertyId as string;
    if (!propertyId) return res.status(404).json({ message: "propertyId manquant" });
    const userId = req.user!.userId;
    const profiles = await allUserProfiles(userId);
    if (!profiles) return res.status(404).json({ message: "Aucun profil trouvé" });
    if (!profiles[0]) return res.status(404).json({ message: "Profil introuvable" });
    const ownerId = profiles[0]?.id;

    const recipientEmail = req.body.recipientEmail;
    const transmissionToken = await createTransmissionToken(recipientEmail, ownerId, propertyId);
    const url = `${process.env.FRONTEND_URL}/transmission/${transmissionToken.token}`;
    return res.status(201).json(url);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la transmisison du bien" });
  }
};
