import type { Request, Response } from "express";
import {
  register,
  generateTokens,
  login,
  refreshAccessToken,
  userConnectedInfos,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service";
import { createProfile } from "../services/profile.service";
import type { profileRole } from "../../prisma/generated/enums";

export const registerController = async (req: Request, res: Response) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const newUser = await register(userEmail, userPassword);
    const userTokens = await generateTokens(newUser.id);
    res.cookie("refreshToken", userTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    const data = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      role: "INDIVIDUAL" as profileRole,
    };
    await createProfile(data, newUser.id);
    return res.status(201).json({ user: newUser, accessToken: userTokens.accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const loginUser = await login(userEmail, userPassword);
    const userTokens = await generateTokens(loginUser.id);
    res.cookie("refreshToken", userTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json({ user: loginUser, accessToken: userTokens.accessToken });
  } catch (error) {
    if (error instanceof Error && error.message === "Identifiants incorrects") {
      return res.status(401).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};

export const refreshController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Non autorisé" });
  try {
    const userTokens = await refreshAccessToken(refreshToken);
    res.cookie("refreshToken", userTokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json({ accessToken: userTokens.accessToken });
  } catch (error) {
    return res.status(401).json({ message: "Non autorisé" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  // Refresh token stateless (JWT signé, pas de stockage en base) : rien à révoquer côté serveur,
  // il suffit de retirer le cookie httpOnly pour que le navigateur ne le renvoie plus.
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Déconnecté" });
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    await requestPasswordReset(email);
    // Même réponse que l'email existe ou non : ne jamais révéler quels emails ont un compte.
    return res.status(200).json({ message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    return res.status(200).json({ message: "Mot de passe réinitialisé" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Une erreur est survenue";
    return res.status(500).json({ message });
  }
};

export const meController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Une erreur est survenue" });
  try {
    const user = await userConnectedInfos(userId);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
