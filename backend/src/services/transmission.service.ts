import { email, includes, property } from "zod";
import { houseType, type transmissionStatus } from "../../prisma/generated/enums";
import prisma from "../lib/prisma";
import type { Profile, Property } from "../../prisma/generated/client";

export const createTransmissionToken = async (recipientEmail: string, ownerId: string, propertyId: string) => {
  const ownerProfile = await prisma.profile.findUnique({
    where: { id: ownerId },
    select: { user: { select: { email: true } } },
  });
  const userEmail = ownerProfile?.user.email;

  if (userEmail === recipientEmail)
    throw new Error("L'email du destinataire est le même que le propriétaire actuel du bien.");

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new Error("Bien introuvable");
  if (!(property.profileId === ownerId)) throw new Error("Non autorisé");

  const latestTransmission = await prisma.transmissionToken.findFirst({
    where: { propertyId },
    orderBy: { createdAt: "desc" },
  });

  if (latestTransmission && ["pending", "clicked"].includes(latestTransmission.status)) {
    throw new Error("Une transmission est déjà en cours pour ce bien. Contactez le destinataire ou annulez-la avant d'en créer une nouvelle.");
  }
  if (latestTransmission && latestTransmission.status === "accepted") {
    throw new Error("Une transmission est en attente de votre confirmation finale. Confirmez ou annulez-la avant d'en créer une nouvelle.");
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

export const translissionTokenUserPropertyInfos = (property: Property, profile: Profile) => {
  const { name, address, houseType, surface } = property;
  const { firstName, lastName } = profile;
  const returnDatas = {
    property: { name, address, houseType, surface },
    owner: { firstName, lastName },
  };
  return returnDatas;
};

export const getTransmissionTokenInfos = async (token: string) => {
  // le but est de gérer ce qui se passe si le destinataire a cliqué sur le lien. le but du transmission token est de permettre au destinataire de confirmer le fait qu'il accepte la transmission du bien provenant du propriétaire du bien qu'il souhaite acheter

  // j'utilise le token pour récupérer le TransmissionToken et ainsi en extraire les infos et les mettre à jour
  const transmissionToken = await prisma.transmissionToken.findUnique({
    where: { token },
    include: { property: { include: { profile: true } } },
  });
  // Pas de TransmissionToken => on indique "pas de transmission en cours"
  if (!transmissionToken) throw new Error("Pas de transmission en cours");

  // Je vérifie le status et je donne des return en fonction

  // pending
  if (transmissionToken.status === "pending") {
    const status = "clicked";
    const clickedAt = new Date();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await prisma.transmissionToken.update({
      where: { token },
      data: { status, clickedAt, expiresAt },
    });
    return translissionTokenUserPropertyInfos(transmissionToken.property, transmissionToken.property.profile);
  }

  // clicked
  if (transmissionToken.status === "clicked") {
    const expiredAt = transmissionToken.expiresAt;
    if (!expiredAt) throw new Error("Erreur lors de la transmission");
    if (expiredAt < new Date()) {
      await prisma.transmissionToken.update({ where: { token }, data: { status: "expired" } });
      throw new Error("Délai de confirmation dépassé. Recontacter le vendeur.");
    }
    return translissionTokenUserPropertyInfos(transmissionToken.property, transmissionToken.property.profile);
  }

  // accepted
  if (transmissionToken.status === "accepted") {
    return translissionTokenUserPropertyInfos(transmissionToken.property, transmissionToken.property.profile);
  }
  // confirmed
  if (transmissionToken.status === "confirmed") {
    return translissionTokenUserPropertyInfos(transmissionToken.property, transmissionToken.property.profile);
  }
  // cancelled
  if (transmissionToken.status === "cancelled") {
    return translissionTokenUserPropertyInfos(transmissionToken.property, transmissionToken.property.profile);
  }
  // expired
  if (transmissionToken.status === "expired") {
    return translissionTokenUserPropertyInfos(transmissionToken.property, transmissionToken.property.profile);
  }
};
