import type { Request, Response } from "express";
import {
  allUserProfiles,
  createProfile,
  deleteProfile,
  getProfileById,
  updateProfile,
} from "../services/profile.service";

export const createProfileController = async (req: Request, res: Response) => {
  const { firstName, lastName, companyName, phoneNumber, role } = req.body;
  const userId = req.user?.userId;
  const data = { firstName, lastName, companyName: companyName ?? null, phoneNumber, role };

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
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    const myProfile = await getProfileById(profileId, userId);
    return res.status(200).json(myProfile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profil non trouvé";
    return res.status(500).json({ message });
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
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });
  const { firstName, lastName, companyName, phoneNumber, role } = req.body;
  const data = {
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    companyName: companyName ?? null,
    phoneNumber: phoneNumber ?? null,
    role,
  };

  try {
    const profileToUpdate = await updateProfile(idProfileToUpdate, userId, data);
    return res.status(200).json(profileToUpdate);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème lors de la mise à jour du profil";
    return res.status(500).json({ message });
  }
};

export const deleteProfileController = async (req: Request, res: Response) => {
  const idProfileToDelete = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    await deleteProfile(idProfileToDelete, userId);
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème rencontré lors de la suppression du profil";
    return res.status(500).json({ message });
  }
};
