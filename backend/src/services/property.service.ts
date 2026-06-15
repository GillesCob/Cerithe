import prisma from "../lib/prisma.js";
import type { PropertyDto } from "../validators/property.validator";

export const createProperty = async (data: PropertyDto, profileId: string) => {
  const newProperty = await prisma.property.create({ data: { ...data, profileId } });
  return newProperty;
};

export const getPropertyById = async (id: string) => {
  const myProperty = await prisma.property.findUnique({ where: { id } });
  if (!myProperty) throw new Error("Bien non trouvé");
  return myProperty;
};

export const allOwnerProperties = async (id: string) => {
  const allProperties = await prisma.property.findMany({ where: { profileId: id } });
  return allProperties;
};

export const updateProperty = async (id: string, data: Partial<PropertyDto>) => {
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) throw new Error("Erreur lors de la mise à jour du bien");
  const propertyModified = await prisma.property.update({ where: { id }, data });
  return propertyModified;
};

export const deleteProperty = async (id: string) => {
  const propertyExist = await prisma.property.findUnique({ where: { id } });
  if (!propertyExist) throw new Error("Bien non trouvé");
  await prisma.property.delete({ where: { id } });
};
