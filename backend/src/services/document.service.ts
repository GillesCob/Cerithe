import type { documentType } from "../../prisma/generated/enums";
import prisma from "../lib/prisma";
import { deleteDocumentFile } from "./storage.service";

export const createDocument = async (title: string, type: documentType, url: string, propertyId: string) => {
  const data = { title, type, url, propertyId };
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

export const deleteDocument = async (id: string, userId: string) => {
  const document = await prisma.document.findUnique({
    where: { id },
    include: { property: { include: { profile: true } } },
  });
  if (!document) throw new Error("Document non trouvé");
  if (!document.property || document.property.profile.userId !== userId) throw new Error("Non autorisé");
  await deleteDocumentFile(document.url);
  await prisma.document.delete({ where: { id } });
};
