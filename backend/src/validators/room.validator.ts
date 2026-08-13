import { z } from "zod";

// Liste complete cadree dans suivi.html (13/08) : 3 groupes (Espaces courants / Annexes / Autre),
// meme enum Prisma en dur que les 5 autres enums du projet, pas de table de reference.
export const ROOM_TYPES = [
  "BEDROOM",
  "LIVING_ROOM",
  "KITCHEN",
  "BATHROOM",
  "SHOWER_ROOM",
  "WC",
  "OFFICE",
  "ENTRANCE",
  "HALLWAY",
  "GARAGE",
  "CELLAR",
  "ATTIC",
  "TERRACE",
  "BALCONY",
  "GARDEN",
  "DRESSING_ROOM",
  "STORAGE_ROOM",
  "LAUNDRY_ROOM",
  "TECHNICAL_ROOM",
  "OTHER",
] as const;

// Creation groupee depuis la Modale d'ajout (Formulaire 2) : une entree par tuile cochee
// (niveau + type + quantite), le service genere une ligne Room par unite de quantite.
export const createRoomsSchema = z.object({
  propertyId: z.string().min(1),
  rooms: z
    .array(
      z.object({
        level: z.number().int(),
        roomType: z.enum(ROOM_TYPES),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});

export type CreateRoomsDto = z.infer<typeof createRoomsSchema>;

// Page de modification d'une piece (Formulaire 4) : name jamais vide/en doublon (verifie en
// service), surface sans contrainte de saisie forcee (decision produit du 13/08, cf suivi.html).
export const updateRoomSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  level: z.number().int().optional(),
  roomType: z.enum(ROOM_TYPES).optional(),
  surface: z.number().nullish(),
});

export type UpdateRoomDto = z.infer<typeof updateRoomSchema>;
