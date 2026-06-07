import prisma from "../lib/prisma.js";
import { hashPassword } from "../lib/hash.js";

export const register = async (email: string, password: string) => {
  const userExist = await prisma.user.findUnique({ where: { email } });

  if (userExist) {
    throw new Error("L'email est déjà utilisé");
  } else {
    const hashedPassword: string = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email: email,
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
