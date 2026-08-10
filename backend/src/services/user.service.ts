import prisma from "../lib/prisma.js";

export const deleteUser = async (userId: string) => {
  const userExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExist) throw new Error("Utilisateur non trouvé");

  // Cascade en base (onDelete: Cascade sur Profile.user, Property.profile,
  // Transmission.previousOwner/newOwner) : supprime tous les profils du compte,
  // tous leurs biens, et tout l'historique de transmission associé.
  await prisma.user.delete({ where: { id: userId } });
};
