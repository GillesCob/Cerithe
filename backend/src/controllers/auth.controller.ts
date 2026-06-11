import type { Request, Response } from "express";
import { register, generateTokens, login } from "../services/auth.service";

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
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};
