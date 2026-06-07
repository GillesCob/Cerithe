import prisma from "../lib/prisma.js";

export const register = async (email: string, password: string) => {
  // Vérifier si l'email existe en BDD
  const userExist = await prisma.user.findUnique({ where: { email } });

  // Si oui lancer une erreur
  if (userExist) {
    return new Error();
  }

  // Si non hasher le mdp

  // créer le user en BDD
  // return user sans pwd
};
