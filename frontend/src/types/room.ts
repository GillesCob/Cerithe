export type RoomType =
  | "BEDROOM"
  | "LIVING_ROOM"
  | "KITCHEN"
  | "BATHROOM"
  | "SHOWER_ROOM"
  | "WC"
  | "OFFICE"
  | "ENTRANCE"
  | "HALLWAY"
  | "GARAGE"
  | "CELLAR"
  | "ATTIC"
  | "TERRACE"
  | "BALCONY"
  | "GARDEN"
  | "DRESSING_ROOM"
  | "STORAGE_ROOM"
  | "LAUNDRY_ROOM"
  | "TECHNICAL_ROOM"
  | "OTHER";

export interface IRoom {
  id: string;
  name: string;
  roomType: RoomType;
  level: number;
  surface: number | null;
  floorFinition: string | null;
  wallFinition: string | null;
  ceilingFinition: string | null;
  propertyId: string;
}
