import type { transmissionStatus } from "../../prisma/generated/enums";
import prisma from "../lib/prisma";

export const createTransmissionToken = async (recipientEmail: string, ownerId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new Error("Bien introuvable");
  if (!(property.profileId === ownerId)) throw new Error("Non autorisé");

  const existingToken = await prisma.transmissionToken.findFirst({ where: { propertyId } });

  if (existingToken && ["accepted", "confirmed"].includes(existingToken.status)) throw new Error("Bien déjà transmis");
  if (existingToken && ["pending", "clicked"].includes(existingToken.status)) {
    const data = { status: "cancelled" as transmissionStatus };
    await prisma.transmissionToken.update({ where: { id: existingToken.id }, data });
  }
  const token = crypto.randomUUID();
  const data = {
    recipientEmail,
    token,
    propertyId,
  };
  const transmissionToken = await prisma.transmissionToken.create({ data });

  return transmissionToken;
};
