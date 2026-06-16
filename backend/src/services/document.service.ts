import type { documentType } from "../../prisma/generated/enums";
import prisma from "../lib/prisma";

export const createDocument = async (title: string, type: documentType, url: string, propertyId: string) => {
  const data = { title, type, url, propertyId };
  const newDocument = await prisma.document.create({ data });
  return newDocument;
};
