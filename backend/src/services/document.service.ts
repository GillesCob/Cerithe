import type { documentType } from "../../prisma/generated/enums";
import prisma from "../lib/prisma";
import { deleteDocumentFile } from "./storage.service";

// propertyId/roomId exclusifs (l'un des deux, jamais les deux) : deja verifie par le controller
// avant d'appeler ce service, cf createDocumentController.
export const createDocument = async (
  title: string,
  type: documentType,
  url: string,
  propertyId?: string,
  roomId?: string,
) => {
  // propertyId/roomId exclusifs (deja verifie par le controller) : construits en litteral distinct
  // plutot que via omitUndefined, pour que Prisma choisisse sans ambiguite sa variante Unchecked de create.
  const data = propertyId !== undefined ? { title, type, url, propertyId } : { title, type, url, roomId: roomId! };
  const newDocument = await prisma.document.create({ data });
  return newDocument;
};

export const getDocumentsByProperty = async (propertyId: string) => {
  const documents = await prisma.document.findMany({
    where: { propertyId },
    orderBy: { createdAt: "desc" },
  });
  return documents;
};

export const getDocumentsByRoom = async (roomId: string) => {
  const documents = await prisma.document.findMany({
    where: { roomId },
    orderBy: { createdAt: "desc" },
  });
  return documents;
};

// document.property est present pour un document rattache directement au bien, document.room
// pour un document rattache a une piece (le profil proprietaire se lit alors via room.property).
const getDocumentOwnerUserId = (document: {
  property: { profile: { userId: string } } | null;
  room: { property: { profile: { userId: string } } } | null;
}) => document.property?.profile.userId ?? document.room?.property.profile.userId;

export const deleteDocument = async (id: string, userId: string) => {
  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      property: { include: { profile: true } },
      room: { include: { property: { include: { profile: true } } } },
    },
  });
  if (!document) throw new Error("Document non trouvé");
  if (getDocumentOwnerUserId(document) !== userId) throw new Error("Non autorisé");
  await deleteDocumentFile(document.url);
  await prisma.document.delete({ where: { id } });
};

export const getDocumentForDownload = async (id: string, userId: string) => {
  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      property: { include: { profile: true } },
      room: { include: { property: { include: { profile: true } } } },
    },
  });
  if (!document) throw new Error("Document non trouvé");
  if (getDocumentOwnerUserId(document) !== userId) throw new Error("Non autorisé");
  return document;
};
