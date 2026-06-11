// J'identifie le verbe HTTP, POST dans notre cas
//Je récupère mail et mdp de req
//J'envoie dans le service qui va register
//J'appelle le service generateTokens afin de créer l'AT et Refresh
//J'envoie le RT dans les cookies du navigateur
//je renvoi un objet dans res avec le user et l'AT vers le front
import type { Request, Response } from "express";
import { register, generateTokens } from "../services/auth.service";

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
    console.error(error);
    return res.status(500).json({ message: "Une erreur est survenue" });
  }
};

//J'identifie le verge HTTP, POST ici
//j'ai une requ avec email et pwd
//Je vérifie avec
//Je vérifie si l'email est en BDD
//Si oui je récupère le mdp hashé
//je hash le mdp de la requête et je compare avec le mdp présent en BDD
//Si ok alors on peut générer AT et RT de la même manière que pour le register
