import prisma from "../lib/prisma.js";
import { hashPassword, verifyPassword, hashResetToken } from "../lib/hash.js";
import { sendPasswordResetEmail } from "../lib/resend.js";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export const register = async (email: string, password: string) => {
  const userExist = await prisma.user.findUnique({ where: { email } });

  if (userExist) {
    throw new Error("L'email est déjà utilisé");
  } else {
    const hashedPassword: string = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
    return newUser;
  }
};

export const login = async (email: string, password: string) => {
  const userExist = await prisma.user.findUnique({ where: { email } });

  if (!userExist) throw new Error("Identifiants incorrects");
  const passwordIsCorrect = await verifyPassword(password, userExist.password);
  if (!passwordIsCorrect) throw new Error("Identifiants incorrects");
  const { password: _, ...userWithoutPassword } = userExist;
  return userWithoutPassword;
};

export const generateTokens = async (id: string) => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN!;
  const accessTokenOptions: SignOptions = { expiresIn: expiresIn as Exclude<SignOptions["expiresIn"], undefined> };
  const accessToken = jwt.sign({ userId: id }, secret, accessTokenOptions);

  const refreshSecret = process.env.JWT_REFRESH_SECRET!;
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN!;
  const refreshTokenOptions: SignOptions = {
    expiresIn: refreshExpiresIn as Exclude<SignOptions["expiresIn"], undefined>,
  };
  const refreshToken = jwt.sign({ userId: id }, refreshSecret, refreshTokenOptions);

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;
  const decoded = jwt.verify(refreshToken, refreshSecret) as { userId: string };
  return generateTokens(decoded.userId);
};

export const userConnectedInfos = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User non trouvé");
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  // Ne pas révéler si l'email existe ou non : on ne throw rien, le controller renvoie toujours le même message.
  if (!user) return;

  const rawToken = crypto.randomUUID();
  const hashedToken = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  // Un seul token valide à la fois par utilisateur : on invalide les précédents avant d'en créer un nouveau.
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({ data: { token: hashedToken, userId: user.id, expiresAt } });

  await sendPasswordResetEmail(email, rawToken);
};

export const resetPassword = async (rawToken: string, newPassword: string) => {
  const hashedToken = hashResetToken(rawToken);
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token: hashedToken } });
  if (!resetToken) throw new Error("Lien de réinitialisation invalide ou déjà utilisé");
  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
    throw new Error("Lien de réinitialisation expiré, faites une nouvelle demande");
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashedPassword } });
  await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
};
