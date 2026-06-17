import type { Request, Response } from "express";
import {
  allUserProfiles,
  createProfile,
  deleteProfile,
  getProfileById,
  updateProfile,
} from "../services/profile.service";

export const createProfileController = async (req: Request, res: Response) => {
  const { firstName, lastName, phoneNumber, role } = req.body;
  const userId = req.user?.userId;
  const data = { firstName, lastName, phoneNumber, role };

  if (!userId) return res.status(500).json({ message: "Impossible de créer le profil" });
  try {
    const newProfile = await createProfile(data, userId);
    return res.status(201).json(newProfile);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Impossible de créer le profil" });
  }
};

export const readOneProfileController = async (req: Request, res: Response) => {
  const profileId = req.params.id as string;
  try {
    const myProfile = await getProfileById(profileId);
    return res.status(200).json(myProfile);
  } catch (error) {
    return res.status(500).json({ message: "Profil non trouvé" });
  }
};

export const readManyProfilesController = async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  try {
    const myProfiles = await allUserProfiles(userId);
    return res.status(200).json(myProfiles);
  } catch (error) {
    return res.status(500).json({ message: "Profiles non trouvés" });
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
  const idProfileToUpdate = req.params.id as string;
  const { firstName, lastName, phoneNumber, role } = req.body;
  const data = { firstName, lastName, phoneNumber, role };

  try {
    const profileToUpdate = await updateProfile(idProfileToUpdate, data);
    return res.status(200).json(profileToUpdate);
  } catch (error) {
    return res.status(500).json({ message: "Problème lors de la mise à jour du profil" });
  }
};

export const deleteProfileController = async (req: Request, res: Response) => {
  const idProfileToDelete = req.params.id as string;

  try {
    await deleteProfile(idProfileToDelete);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Problème rencontré lors de la suppression du profil" });
  }
};
