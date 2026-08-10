import prisma from "../lib/prisma.js";
import type { PropertyDto } from "../validators/property.validator";

export const createProperty = async (data: PropertyDto) => {
  const newProperty = await prisma.property.create({ data });
  return newProperty;
};

export const getPropertyById = async (id: string, userId: string) => {
  const myProperty = await prisma.property.findUnique({ where: { id }, include: { profile: true } });
  if (!myProperty) throw new Error("Bien non trouvé");
  if (myProperty.profile.userId !== userId) throw new Error("Non autorisé");
  return myProperty;
};

export const allOwnerProperties = async (profileId: string) => {
  const allProperties = await prisma.property.findMany({ where: { profileId } });
  return allProperties;
};

export const updateProperty = async (id: string, userId: string, data: Partial<PropertyDto>) => {
  const property = await prisma.property.findUnique({ where: { id }, include: { profile: true } });
  if (!property) throw new Error("Bien non trouvé");
  if (property.profile.userId !== userId) throw new Error("Non autorisé");
  const propertyModified = await prisma.property.update({ where: { id }, data });
  return propertyModified;
};

export const deleteProperty = async (id: string, userId: string) => {
  const propertyExist = await prisma.property.findUnique({ where: { id }, include: { profile: true } });
  if (!propertyExist) throw new Error("Bien non trouvé");
  if (propertyExist.profile.userId !== userId) throw new Error("Non autorisé");
  await prisma.property.delete({ where: { id } });
};
