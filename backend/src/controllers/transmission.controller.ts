import type { Request, Response } from "express";
import { createTransmissionToken, getTransmissionTokenInfos, acceptTransmissionToken } from "../services/transmission.service";
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

export const readOneTransmissionController = async (req: Request, res: Response) => {
  const token = req.params.token as string;
  const userId = req.user!.userId;
  try {
    const transmissionInfos = await getTransmissionTokenInfos(token, userId);
    return res.status(200).json(transmissionInfos);
  } catch (error) {
    console.error(error);
    // TODO: messages génériques pour toutes les erreurs de ce controller, à préciser pour l'utilisateur
    // (ex: différencier "pas le bon destinataire" d'une vraie erreur serveur) une fois un typage d'erreur en place.
    return res.status(500).json({ message: "Transmission introuvable" });
  }
};

export const acceptTransmissionController = async (req: Request, res: Response) => {
  const token = req.params.token as string;
  const userId = req.user!.userId;
  try {
    const transmissionToken = await acceptTransmissionToken(token, userId);
    return res.status(200).json(transmissionToken);
  } catch (error) {
    console.error(error);
    // TODO: cf remarque plus haut, message générique en attendant un typage d'erreur.
    return res.status(500).json({ message: "Impossible d'accepter la transmission" });
  }
};
