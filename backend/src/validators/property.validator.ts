import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1),
  address: z.string(),
  houseType: z.enum(["HOUSE", "APPARTMENT"]),
  surface: z.number(),
  numberOfLevels: z.number(),
  numberOfBasementLevels: z.number().min(0).max(1).optional(),
  profileId: z.string().min(1),
});

export type PropertyDto = z.infer<typeof propertySchema>;

// Pas de contrainte .min(1) sur name/address ici : une mise a jour partielle (PUT avec seulement
// numberOfLevels par exemple) ne doit pas echouer sur des champs absents du payload. numberOfBasementLevels
// plafonne a 1 verifie aussi cote back (pas seulement l'absence de bouton "+1" cote front, cf suivi.html).
export const updatePropertySchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  houseType: z.enum(["HOUSE", "APPARTMENT"]).optional(),
  surface: z.number().optional(),
  numberOfLevels: z.number().optional(),
  numberOfBasementLevels: z.number().min(0).max(1).optional(),
});

export type UpdatePropertyDto = z.infer<typeof updatePropertySchema>;

export const transferPropertyOwnerSchema = z.object({
  profileId: z.string().min(1),
});

export type TransferPropertyOwnerDto = z.infer<typeof transferPropertyOwnerSchema>;
