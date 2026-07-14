import argon2 from "argon2";
import crypto from "crypto";

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

// Pour le token de reset password : pas argon2. Le token est déjà aléatoire à haute entropie
// (crypto.randomUUID), contrairement à un mot de passe choisi par un humain — pas besoin d'un hash lent
// résistant au brute force. On a en revanche besoin de le retrouver directement en base (WHERE token = ...),
// ce qu'un hash argon2 (salé, non déterministe) ne permet pas.
export const hashResetToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
