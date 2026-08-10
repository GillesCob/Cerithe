import type { Request, Response } from "express";
import {
  allOwnerProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../services/property.service";
import { getProfileById } from "../services/profile.service";

export const createPropertyController = async (req: Request, res: Response) => {
  const { name, address, houseType, surface, numberOfLevels, profileId } = req.body;
  const data = { name, address, houseType, surface, numberOfLevels, profileId };

  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    // Le profil actif est choisi par le client (navbar/switcher), jamais devine cote serveur.
    // getProfileById verifie que ce profil appartient bien a l'utilisateur connecte.
    await getProfileById(profileId, userId);
    const newProperty = await createProperty(data);
    return res.status(201).json(newProperty);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Impossible de créer le bien" });
  }
};

export const readOnePropertyController = async (req: Request, res: Response) => {
  const propertyId = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    const myProperty = await getPropertyById(propertyId, userId);
    return res.status(200).json(myProperty);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bien non trouvé";
    return res.status(500).json({ message });
  }
};

export const readManyPropertiesController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });
  const profileId = req.query.profileId as string;
  if (!profileId) return res.status(400).json({ message: "profileId manquant" });

  try {
    // Filtre strict sur le profil actif choisi par le client : jamais de melange des biens
    // entre profils sur une meme page (cf cerithe-decisions-produit.md, 29/07).
    await getProfileById(profileId, userId);
    const myProperties = await allOwnerProperties(profileId);
    return res.status(200).json(myProperties);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Biens non trouvés";
    return res.status(500).json({ message });
  }
};

export const updatePropertyController = async (req: Request, res: Response) => {
  const idPropertyToUpdate = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });
  const { name, address, houseType, surface, numberOfLevels } = req.body;
  const data = { name, address, houseType, surface, numberOfLevels };

  try {
    const propertyToUpdate = await updateProperty(idPropertyToUpdate, userId, data);
    return res.status(200).json(propertyToUpdate);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème lors de la mise à jour du bien";
    return res.status(500).json({ message });
  }
};

export const deletePropertyController = async (req: Request, res: Response) => {
  const idPropertyToDelete = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    await deleteProperty(idPropertyToDelete, userId);
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème rencontré lors de la suppression du bien";
    return res.status(500).json({ message });
  }
};
