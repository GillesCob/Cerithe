import type { Request, Response } from "express";
import {
  allOwnerProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../services/property.service";
import { allUserProfiles } from "../services/profile.service";

export const createPropertyController = async (req: Request, res: Response) => {
  const { name, address, houseType, surface, numberOfLevels } = req.body;
  const data = { name, address, houseType, surface, numberOfLevels };

  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    const profiles = await allUserProfiles(userId);
    const profileId = profiles[0]?.id;
    if (!profileId) return res.status(500).json({ message: "Impossible de créer le bien" });
    const newProperty = await createProperty(data, profileId);
    return res.status(201).json(newProperty);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Impossible de créer le bien" });
  }
};

export const readOnePropertyController = async (req: Request, res: Response) => {
  const propertyId = req.params.id as string;
  try {
    const myProperty = await getPropertyById(propertyId);
    return res.status(200).json(myProperty);
  } catch (error) {
    return res.status(500).json({ message: "Bien non trouvé" });
  }
};

export const readManyPropertiesController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    const profiles = await allUserProfiles(userId);
    const profileId = profiles[0]?.id;
    if (!profileId) return res.status(500).json({ message: "Biens non trouvés" });
    const myProperties = await allOwnerProperties(profileId);
    return res.status(200).json(myProperties);
  } catch (error) {
    return res.status(500).json({ message: "Biens non trouvés" });
  }
};

export const updatePropertyController = async (req: Request, res: Response) => {
  const idPropertyToUpdate = req.params.id as string;
  const { name, address, houseType, surface, numberOfLevels } = req.body;
  const data = { name, address, houseType, surface, numberOfLevels };

  try {
    const propertyToUpdate = await updateProperty(idPropertyToUpdate, data);
    return res.status(200).json(propertyToUpdate);
  } catch (error) {
    return res.status(500).json({ message: "Problème lors de la mise à jour du bien" });
  }
};

export const deletePropertyController = async (req: Request, res: Response) => {
  const idPropertyToDelete = req.params.id as string;

  try {
    await deleteProperty(idPropertyToDelete);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Problème rencontré lors de la suppression du bien" });
  }
};
