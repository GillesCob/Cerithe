import prisma from "../lib/prisma.js";
import type { PropertyDto, UpdatePropertyDto } from "../validators/property.validator";
import { getProfileById } from "./profile.service";
import { omitUndefined } from "../utils/omitUndefined";

export const createProperty = async (data: PropertyDto) => {
  // numberOfBasementLevels a un default(0) en base, mais reste explicite ici : le passer via
  // omitUndefined (comme updateProperty) rendrait tous les champs optionnels aux yeux de Prisma,
  // qui ne saurait alors plus choisir entre ses variantes Checked/Unchecked de create.
  const newProperty = await prisma.property.create({
    data: { ...data, numberOfBasementLevels: data.numberOfBasementLevels ?? 0 },
  });
  return newProperty;
};

export const getPropertyById = async (id: string, userId: string) => {
  const myProperty = await prisma.property.findUnique({
    where: { id },
    include: { profile: true, room: true },
  });
  if (!myProperty) throw new Error("Bien non trouvé");
  if (myProperty.profile.userId !== userId) throw new Error("Non autorisé");
  return myProperty;
};

export const allOwnerProperties = async (profileId: string) => {
  const allProperties = await prisma.property.findMany({ where: { profileId } });
  return allProperties;
};

export const updateProperty = async (id: string, userId: string, data: UpdatePropertyDto) => {
  const property = await prisma.property.findUnique({ where: { id }, include: { profile: true, room: true } });
  if (!property) throw new Error("Bien non trouvé");
  if (property.profile.userId !== userId) throw new Error("Non autorisé");

  // Seule une diminution est bloquee tant que le bien a au moins une piece (quel que soit son
  // niveau) : l'augmentation reste toujours libre, meme avec des pieces existantes (cf suivi.html,
  // v1.6.0, "aucune consequence sur les pieces existantes").
  const hasRooms = property.room.length > 0;
  if (hasRooms && data.numberOfLevels !== undefined && data.numberOfLevels < property.numberOfLevels) {
    throw new Error("Impossible de réduire le nombre de niveaux tant que le bien a des pièces");
  }
  if (
    hasRooms &&
    data.numberOfBasementLevels !== undefined &&
    data.numberOfBasementLevels < property.numberOfBasementLevels
  ) {
    throw new Error("Impossible de supprimer le niveau en sous-sol tant qu'il possède des pièces");
  }

  const propertyModified = await prisma.property.update({ where: { id }, data: omitUndefined(data) });
  return propertyModified;
};

// Bascule d'un bien entre deux profils du meme compte (v1.5.0). Distinct de
// confirmTransmissionToken (transmission.service.ts) qui gere une transmission
// vers un tiers : ce flux-ci reste interne au compte connecte, d'ou les deux
// controles specifiques ci-dessous absents du pattern reutilise.
export const transferPropertyOwner = async (id: string, userId: string, newProfileId: string) => {
  const property = await prisma.property.findUnique({ where: { id }, include: { profile: true } });
  if (!property) throw new Error("Bien non trouvé");
  if (property.profile.userId !== userId) throw new Error("Non autorisé");

  // Verifie que le nouveau profil appartient bien au meme compte : getProfileById
  // rejette deja si ce n'est pas le cas (throw "Non autorise"), sans quoi ce bien
  // serait transferable vers n'importe quel profil de la plateforme.
  await getProfileById(newProfileId, userId);

  if (property.profileId === newProfileId) throw new Error("Ce bien appartient déjà à ce profil");

  // Une transmission active (token en attente/accepte) bloque le changement de
  // propriétaire tant qu'elle n'est pas annulée : activePropertyId ne vaut
  // l'id du bien que pour une transmission encore active (cf schema.prisma).
  const activeTransmission = await prisma.transmissionToken.findUnique({ where: { activePropertyId: id } });
  if (activeTransmission) throw new Error("Une transmission est en cours sur ce bien, impossible de changer de propriétaire");

  const previousOwnerId = property.profileId;

  const [updatedProperty] = await prisma.$transaction([
    prisma.property.update({ where: { id }, data: { profileId: newProfileId } }),
    prisma.transmission.create({
      data: { propertyId: id, previousOwnerId, newOwnerId: newProfileId },
    }),
  ]);

  return updatedProperty;
};

export const deleteProperty = async (id: string, userId: string) => {
  const propertyExist = await prisma.property.findUnique({ where: { id }, include: { profile: true } });
  if (!propertyExist) throw new Error("Bien non trouvé");
  if (propertyExist.profile.userId !== userId) throw new Error("Non autorisé");
  await prisma.property.delete({ where: { id } });
};
