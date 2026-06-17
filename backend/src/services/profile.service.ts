import prisma from "../lib/prisma.js";
import type { ProfileDto } from "../validators/profile.validator.js";

export const createProfile = async (data: ProfileDto, userId: string) => {
  const newProfile = await prisma.profile.create({ data: { ...data, userId } });
  return newProfile;
};

export const getProfileById = async (id: string) => {
  const myProfile = await prisma.profile.findUnique({ where: { id } });
  if (!myProfile) throw new Error("Profil non trouvé");
  return myProfile;
};

export const allUserProfiles = async (id: string) => {
  const allProfiles = await prisma.profile.findMany({ where: { userId: id } });
  return allProfiles;
};

export const updateProfile = async (id: string, data: Partial<ProfileDto>) => {
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) throw new Error("Erreur lors de la mise à jour du profil");
  const profileModified = await prisma.profile.update({ where: { id }, data });
  return profileModified;
};

export const deleteProfile = async (id: string) => {
  const profileExist = await prisma.profile.findUnique({ where: { id } });
  if (!profileExist) throw new Error("Profil non trouvé");
  await prisma.profile.delete({ where: { id } });
};
