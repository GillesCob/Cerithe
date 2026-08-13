import type { Request, Response } from "express";
import { uploadDocument } from "../services/storage.service";
import {
  createDocument,
  getDocumentsByProperty,
  getDocumentsByRoom,
  deleteDocument,
  getDocumentForDownload,
} from "../services/document.service";
import type { documentType } from "../../prisma/generated/enums";

// Le bucket Supabase limitait déjà l'upload à ces 3 types (contrôle multer/Zod en amont côté formulaire) :
// pas de nouvelle validation ajoutée ici, juste de quoi mettre le bon Content-Type au moment du téléchargement.
const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

export const createDocumentController = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });
  const { buffer, originalname } = req.file;
  const propertyId = (req.body.propertyId as string) || undefined;
  const roomId = (req.body.roomId as string) || undefined;
  const type = req.body.documentType as documentType;

  // propertyId et roomId sont exclusifs (colonnes nullable independantes en base, cf schema.prisma) :
  // un document est rattache soit a un bien, soit a une piece, jamais les deux, jamais aucun des deux.
  if ((!propertyId && !roomId) || (propertyId && roomId)) {
    return res.status(400).json({ message: "Le document doit être rattaché à un bien ou à une pièce, jamais les deux" });
  }

  try {
    const newDocument = await uploadDocument(buffer, originalname);

    const newDbEntry = await createDocument(originalname, type, newDocument.path, propertyId, roomId);
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

export const getDocumentsByRoomController = async (req: Request, res: Response) => {
  const roomId = req.params.roomId as string;
  try {
    const documents = await getDocumentsByRoom(roomId);
    return res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de la récupération des documents" });
  }
};

export const downloadDocumentController = async (req: Request, res: Response) => {
  const documentId = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    const document = await getDocumentForDownload(documentId, userId);
    const extension = document.url.split(".").pop()?.toLowerCase() ?? "";
    const contentType = MIME_TYPES_BY_EXTENSION[extension] ?? "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(document.title)}"`);
    res.setHeader("X-Accel-Redirect", `/internal-documents/${document.url}`);
    return res.status(200).end();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème lors du téléchargement du document";
    return res.status(500).json({ message });
  }
};

export const deleteDocumentController = async (req: Request, res: Response) => {
  const documentId = req.params.id as string;
  const userId = req.user?.userId;
  if (!userId) return res.status(500).json({ message: "Utilisateur manquant" });

  try {
    await deleteDocument(documentId, userId);
    return res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Problème lors de la suppression du document";
    return res.status(500).json({ message });
  }
};
