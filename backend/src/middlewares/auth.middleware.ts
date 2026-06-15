//Je récupère la requête et j'extrait l'AT du header
// Si pas d'AT, je renvoi une 401 sinon je continue
// Je vérifie si le token est expiré ou non
// => Si expiré, 401 sinon je continue
//je récupère le secret du .env, lecture possible grâce à dotenv/config importé dans server.ts
//J'utilise jsonwebtoken et jwt.verify() qui va créer une nouvelle signature avec le header/payload de l'AT de la requête et le secret issus du .env
//Si signatures = alors ça passe
// J'ajoute les infos issues du payload (donc les infos du user) dans la requête avec req.user = decoded

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
