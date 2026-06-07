import argon2 from "argon2";

export const hashPassword = async (password: string) => {
  return await argon2.hash(password);
};

export const verifyPassword = async (password: string, hash: string) => {
  let isValid: boolean;
  try {
    isValid = await argon2.verify(hash, password);
  } catch (err) {
    throw new Error("Erreur lors de la vérification du mot de passe");
  }
  if (isValid) {
    return true;
  } else {
    throw new Error("Mot de passe incorrect");
  }
};
