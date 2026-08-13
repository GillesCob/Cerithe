import prisma from "../lib/prisma";
import type { CreateRoomsDto, UpdateRoomDto } from "../validators/room.validator";
import type { roomType } from "../../prisma/generated/enums";
import { deleteDocumentFile } from "./storage.service";
import { omitUndefined } from "../utils/omitUndefined";

// Utilise uniquement pour generer le nom automatique ("Chambre 1", "Chambre 2"...), distinct des
// labels d'affichage frontend (icones + noms geres cote UI, cf suivi.html "icones hardcodees en front").
const ROOM_TYPE_LABELS: Record<string, string> = {
  BEDROOM: "Chambre",
  LIVING_ROOM: "Salon",
  KITCHEN: "Cuisine",
  BATHROOM: "Salle de bain",
  SHOWER_ROOM: "Salle d'eau",
  WC: "WC",
  OFFICE: "Bureau",
  ENTRANCE: "Entrée",
  HALLWAY: "Couloir",
  GARAGE: "Garage",
  CELLAR: "Cave",
  ATTIC: "Grenier",
  TERRACE: "Terrasse",
  BALCONY: "Balcon",
  GARDEN: "Jardin",
  DRESSING_ROOM: "Dressing",
  STORAGE_ROOM: "Cellier",
  LAUNDRY_ROOM: "Buanderie",
  TECHNICAL_ROOM: "Local technique",
  OTHER: "Autre",
};

const getOwnedProperty = async (propertyId: string, userId: string) => {
  const property = await prisma.property.findUnique({ where: { id: propertyId }, include: { profile: true } });
  if (!property) throw new Error("Bien non trouvé");
  if (property.profile.userId !== userId) throw new Error("Non autorisé");
  return property;
};

const getOwnedRoom = async (roomId: string, userId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { property: { include: { profile: true } } },
  });
  if (!room) throw new Error("Pièce non trouvée");
  if (room.property.profile.userId !== userId) throw new Error("Non autorisé");
  return room;
};

export const createRooms = async (userId: string, data: CreateRoomsDto) => {
  await getOwnedProperty(data.propertyId, userId);

  const existingRooms = await prisma.room.findMany({
    where: { propertyId: data.propertyId },
    select: { name: true },
  });
  // Compteur par type maintenu en memoire pendant la generation : plusieurs tuiles du meme type
  // dans la meme requete (ex. 2 niveaux avec des Chambres) doivent quand meme obtenir des numeros
  // consecutifs uniques, sans relire la base entre chaque ligne.
  const usedNames = new Set(existingRooms.map((room) => room.name));
  const nextNumberByType: Record<string, number> = {};

  // Le premier exemplaire d'un type garde le label seul ("Salon"), jamais suffixe "1" : le
  // suffixe numerique n'apparait qu'a partir du 2e exemplaire du meme type ("Salon 2"...).
  const nextAvailableName = (roomType: string) => {
    const label = ROOM_TYPE_LABELS[roomType] ?? roomType;
    let candidate = nextNumberByType[roomType] ?? 1;
    let name = candidate === 1 ? label : `${label} ${candidate}`;
    while (usedNames.has(name)) {
      candidate += 1;
      name = candidate === 1 ? label : `${label} ${candidate}`;
    }
    usedNames.add(name);
    nextNumberByType[roomType] = candidate + 1;
    return name;
  };

  const rows = data.rooms.flatMap((entry) =>
    Array.from({ length: entry.quantity }, () => ({
      name: nextAvailableName(entry.roomType),
      roomType: entry.roomType as roomType,
      level: entry.level,
      propertyId: data.propertyId,
    })),
  );

  await prisma.room.createMany({ data: rows });
  const createdRooms = await prisma.room.findMany({
    where: { propertyId: data.propertyId, name: { in: rows.map((row) => row.name) } },
  });
  return createdRooms;
};

export const getRoomById = async (id: string, userId: string) => {
  return getOwnedRoom(id, userId);
};

export const updateRoom = async (id: string, userId: string, data: UpdateRoomDto) => {
  const room = await getOwnedRoom(id, userId);

  if (data.name && data.name !== room.name) {
    const duplicate = await prisma.room.findFirst({
      where: { propertyId: room.propertyId, name: data.name, id: { not: id } },
    });
    if (duplicate) throw new Error("Une pièce porte déjà ce nom sur ce bien");
  }

  const roomModified = await prisma.room.update({ where: { id }, data: omitUndefined(data) });
  return roomModified;
};

export const deleteRoom = async (id: string, userId: string) => {
  const room = await getOwnedRoom(id, userId);

  // Le schema a deja onDelete: Cascade (Document.room -> Room), mais ca ne supprime que les lignes
  // en base : les fichiers correspondants sur le disque (storage.service) resteraient orphelins sans
  // ce nettoyage explicite fait avant la suppression de la piece.
  const documents = await prisma.document.findMany({ where: { roomId: room.id } });
  await Promise.all(documents.map((document) => deleteDocumentFile(document.url)));
  await prisma.room.delete({ where: { id } });
};
