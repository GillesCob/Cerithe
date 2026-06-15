import prisma from "../lib/prisma.js";
import { hashPassword, verifyPassword } from "../lib/hash.js";
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

export const userConnectedInfos = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User non trouvé");
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
