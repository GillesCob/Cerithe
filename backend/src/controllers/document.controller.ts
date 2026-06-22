import type { Request, Response } from "express";
import { uploadDocument } from "../services/storage.service";
import { createDocument, getDocumentsByProperty } from "../services/document.service";
import type { documentType } from "../../prisma/generated/enums";

export const createDocumentController = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });
  const { buffer, originalname, mimetype } = req.file;
  const propertyId = req.body.propertyId as string;
  const type = req.body.documentType as documentType;

  try {
    const newDocument = await uploadDocument(buffer, originalname, mimetype);

    const newDbEntry = await createDocument(originalname, type, newDocument.path, propertyId);
    return res.status(201).json({ newDocument, newDbEntry });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de l'ajout du document" });
  }
};

export const getDocumentsByPropertyController = async (req: Request, res: Response) => {
  const propertyId = req.params.propertyId as string;
  try {
    const documents = await getDocumentsByProperty(propertyId);
    return res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la récupération des documents" });
  }
};
