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
    throw new Error(
      "Une transmission est déjà en cours pour ce bien. Contactez le destinataire ou annulez-la avant d'en créer une nouvelle.",
    );
  }
  if (latestTransmission && latestTransmission.status === "accepted") {
    throw new Error(
      "Une transmission est en attente de votre confirmation finale. Confirmez ou annulez-la avant d'en créer une nouvelle.",
    );
  }
  const recipientUser = await prisma.user.findUnique({
    where: { email: recipientEmail },
    include: { profile: true },
  });
  const recipientProfileId =
    recipientUser && recipientUser.profile.length === 1 ? recipientUser.profile[0]!.id : null;

  const token = crypto.randomUUID();
  const data = {
    recipientEmail,
    token,
    propertyId,
    recipientProfileId,
  };
  const transmissionToken = await prisma.transmissionToken.create({ data });

  return transmissionToken;
};

export const transmissionTokenUserPropertyInfos = (property: Property, profile: Profile, recipientProfileId: string | null) => {
  const { name, address, houseType, surface } = property;
  const { firstName, lastName } = profile;
  const returnDatas = {
    property: { name, address, houseType, surface },
    owner: { firstName, lastName },
    recipientKnown: recipientProfileId !== null,
  };
  return returnDatas;
};

export const getTransmissionTokenInfos = async (token: string, userId: string) => {
  // le but est de gérer ce qui se passe si le destinataire a cliqué sur le lien. le but du transmission token est de permettre au destinataire de confirmer le fait qu'il accepte la transmission du bien provenant du propriétaire du bien qu'il souhaite acheter

  // j'utilise le token pour récupérer le TransmissionToken et ainsi en extraire les infos et les mettre à jour
  const transmissionToken = await prisma.transmissionToken.findUnique({
    where: { token },
    include: { property: { include: { profile: true } } },
  });
  // Pas de TransmissionToken => on indique "pas de transmission en cours"
  if (!transmissionToken) throw new Error("Pas de transmission en cours");

  const requestingUser = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (requestingUser?.email !== transmissionToken.recipientEmail)
    throw new Error("Vous n'êtes pas le destinataire de la transmission. Contactez votre vendeur si vous pensez à une erreur.");

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
    return transmissionTokenUserPropertyInfos(
      transmissionToken.property,
      transmissionToken.property.profile,
      transmissionToken.recipientProfileId,
    );
  }

  // clicked
  if (transmissionToken.status === "clicked") {
    const expiredAt = transmissionToken.expiresAt;
    if (!expiredAt) throw new Error("Erreur lors de la transmission");
    if (expiredAt < new Date()) {
      await prisma.transmissionToken.update({ where: { token }, data: { status: "expired" } });
      throw new Error("Délai de confirmation dépassé. Recontacter le vendeur.");
    }
    return transmissionTokenUserPropertyInfos(
      transmissionToken.property,
      transmissionToken.property.profile,
      transmissionToken.recipientProfileId,
    );
  }

  // accepted
  if (transmissionToken.status === "accepted") {
    return transmissionTokenUserPropertyInfos(
      transmissionToken.property,
      transmissionToken.property.profile,
      transmissionToken.recipientProfileId,
    );
  }
  // confirmed
  if (transmissionToken.status === "confirmed") {
    return transmissionTokenUserPropertyInfos(
      transmissionToken.property,
      transmissionToken.property.profile,
      transmissionToken.recipientProfileId,
    );
  }
  // cancelled
  if (transmissionToken.status === "cancelled") {
    return transmissionTokenUserPropertyInfos(
      transmissionToken.property,
      transmissionToken.property.profile,
      transmissionToken.recipientProfileId,
    );
  }
  // expired
  if (transmissionToken.status === "expired") {
    return transmissionTokenUserPropertyInfos(
      transmissionToken.property,
      transmissionToken.property.profile,
      transmissionToken.recipientProfileId,
    );
  }
};

export const acceptTransmissionToken = async (token: string, userId: string) => {
  const transmissionToken = await prisma.transmissionToken.findUnique({ where: { token } });
  if (!transmissionToken) throw new Error("Pas de transmission en cours");

  const requestingUser = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (requestingUser?.email !== transmissionToken.recipientEmail)
    throw new Error("Vous n'êtes pas le destinataire de la transmission. Contactez votre vendeur si vous pensez à une erreur.");

  if (transmissionToken.status !== "clicked") throw new Error("Transmission non disponible pour acceptation.");

  // TODO: cas recipientProfileId null (destinataire avec plusieurs profils) non géré, la modale de choix reste à faire.
  if (!transmissionToken.recipientProfileId) throw new Error("Impossible de déterminer le profil du destinataire.");

  const acceptedAt = new Date();
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  return prisma.transmissionToken.update({
    where: { token },
    data: { status: "accepted", acceptedAt, expiresAt },
  });
};
