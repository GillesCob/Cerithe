import type { documentType } from "../../prisma/generated/enums";
import prisma from "../lib/prisma";

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
