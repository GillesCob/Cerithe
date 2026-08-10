import prisma from "../lib/prisma.js";
import type { ProfileDto } from "../validators/profile.validator.js";

export const createProfile = async (data: ProfileDto, userId: string) => {
  const newProfile = await prisma.profile.create({ data: { ...data, userId } });
  return newProfile;
};

export const getProfileById = async (id: string, userId: string) => {
  const myProfile = await prisma.profile.findUnique({ where: { id } });
  if (!myProfile) throw new Error("Profil non trouvé");
  if (myProfile.userId !== userId) throw new Error("Non autorisé");
  return myProfile;
};

export const allUserProfiles = async (id: string) => {
  const allProfiles = await prisma.profile.findMany({
    where: { userId: id },
    include: { user: { select: { email: true } } },
  });
  // firstName/lastName peuvent être vides (profil auto-créé à l'inscription, jamais complété) : on ajoute
  // l'email à plat pour permettre un repli d'affichage côté frontend, sans exposer le reste du User.
  return allProfiles.map(({ user, ...profile }) => ({ ...profile, email: user.email }));
};

export const updateProfile = async (id: string, userId: string, data: Partial<ProfileDto>) => {
  const profile = await prisma.profile.findUnique({ where: { id } });
  if (!profile) throw new Error("Erreur lors de la mise à jour du profil");
  if (profile.userId !== userId) throw new Error("Non autorisé");
  const profileModified = await prisma.profile.update({ where: { id }, data });
  return profileModified;
};

export const deleteProfile = async (id: string, userId: string) => {
  const profileExist = await prisma.profile.findUnique({ where: { id } });
  if (!profileExist) throw new Error("Profil non trouvé");
  if (profileExist.userId !== userId) throw new Error("Non autorisé");

  // Un compte a toujours au moins un profil (cf cerithe-decisions-produit.md, 05/08) : supprimer
  // le seul profil restant reviendrait a supprimer le compte sans le dire. La suppression du
  // compte lui-meme est une action distincte (DELETE /api/users/me).
  const remainingProfiles = await prisma.profile.count({ where: { userId } });
  if (remainingProfiles <= 1) {
    throw new Error("Impossible de supprimer votre unique profil, supprimez votre compte à la place.");
  }

  // Cascade en base (onDelete: Cascade sur Property.profile, Transmission.previousOwner/newOwner) :
  // supprime aussi tous les biens et l'historique de transmission possedes par ce profil.
  await prisma.profile.delete({ where: { id } });
};
