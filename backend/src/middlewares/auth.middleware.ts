import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.split(" ")[1];

  if (!accessToken) return res.status(401).json({ message: "Non autorisé" });

  const atSecret = process.env.JWT_SECRET;

  if (!atSecret) return res.status(401).json({ message: "Non autorisé" });

  try {
    const decoded = jwt.verify(accessToken, atSecret) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Non autorisé" });
  }
};
