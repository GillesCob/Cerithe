//je récupère les données provenant de supabase (path)
//Je récupère les données provenant du controller (name, type, propertyId)
//je create un nouveau doc avec prisma
//je return soit l'erreur soit le doc créé via untry catch

import type { documentType } from "../../prisma/generated/enums";
import prisma from "../lib/prisma";

export const createDocument = async (title: string, type: documentType, url: string, propertyId: string) => {
  const data = { title, type, url, propertyId };
  const newDocument = await prisma.document.create({ data });
  return newDocument;
};
