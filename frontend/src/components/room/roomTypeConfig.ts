import {
  BedDouble,
  Sofa,
  CookingPot,
  Bath,
  ShowerHead,
  Toilet,
  Briefcase,
  DoorOpen,
  MoveHorizontal,
  Warehouse,
  Archive,
  Triangle,
  SunMedium,
  LayoutGrid,
  TreePine,
  Shirt,
  Package,
  WashingMachine,
  Wrench,
  MoreHorizontal,
} from "lucide-react";
import type { RoomType } from "@/types/room";

// Icones + labels hardcodes en front (decision du 13/08, cf suivi.html) : pas de table de reference
// en base, coherent avec l'enum Prisma en dur cote back (roomType). Une seule source pour ce mapping,
// reutilisee par RoomTypeSelector, AddRoomsModal, RoomPage et PropertyPage (regroupement par piece).
export const ROOM_TYPE_CONFIG: Record<RoomType, { label: string; icon: typeof BedDouble; group: "Espaces courants" | "Annexes" | "Autre" }> = {
  BEDROOM: { label: "Chambre", icon: BedDouble, group: "Espaces courants" },
  LIVING_ROOM: { label: "Salon", icon: Sofa, group: "Espaces courants" },
  KITCHEN: { label: "Cuisine", icon: CookingPot, group: "Espaces courants" },
  BATHROOM: { label: "Salle de bain", icon: Bath, group: "Espaces courants" },
  SHOWER_ROOM: { label: "Salle d'eau", icon: ShowerHead, group: "Espaces courants" },
  WC: { label: "WC", icon: Toilet, group: "Espaces courants" },
  OFFICE: { label: "Bureau", icon: Briefcase, group: "Espaces courants" },
  ENTRANCE: { label: "Entrée", icon: DoorOpen, group: "Espaces courants" },
  HALLWAY: { label: "Couloir", icon: MoveHorizontal, group: "Espaces courants" },
  GARAGE: { label: "Garage", icon: Warehouse, group: "Annexes" },
  CELLAR: { label: "Cave", icon: Archive, group: "Annexes" },
  ATTIC: { label: "Grenier", icon: Triangle, group: "Annexes" },
  TERRACE: { label: "Terrasse", icon: SunMedium, group: "Annexes" },
  BALCONY: { label: "Balcon", icon: LayoutGrid, group: "Annexes" },
  GARDEN: { label: "Jardin", icon: TreePine, group: "Annexes" },
  DRESSING_ROOM: { label: "Dressing", icon: Shirt, group: "Annexes" },
  STORAGE_ROOM: { label: "Cellier", icon: Package, group: "Annexes" },
  LAUNDRY_ROOM: { label: "Buanderie", icon: WashingMachine, group: "Annexes" },
  OTHER: { label: "Autre", icon: MoreHorizontal, group: "Autre" },
  TECHNICAL_ROOM: { label: "Local technique", icon: Wrench, group: "Autre" },
};

export const ROOM_TYPE_GROUPS = ["Espaces courants", "Annexes", "Autre"] as const;
