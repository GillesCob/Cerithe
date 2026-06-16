import type { Request, Response } from "express";
import { uploadDocument } from "../services/storage.service";

export const createDocumentController = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });
  const { buffer, originalname, mimetype } = req.file;
  try {
    const newDocument = await uploadDocument(buffer, originalname, mimetype);
    return res.status(201).json(newDocument);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'ajout du document" });
  }
};
