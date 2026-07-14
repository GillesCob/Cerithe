import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, cohérent avec le bucket Supabase Storage (documents)

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

// multer.single() appelle next(err) sur dépassement de taille, mais sans handler d'erreur global côté app,
// Express renvoie sa page d'erreur par défaut (pas du JSON) — le frontend ne peut alors rien afficher.
// Ce wrapper intercepte l'erreur pour renvoyer une réponse JSON exploitable par isAxiosError côté frontend.
export const uploadSingleDocument = (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Fichier trop volumineux (10MB maximum)" });
    }
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'envoi du fichier" });
    }
    next();
  });
};
