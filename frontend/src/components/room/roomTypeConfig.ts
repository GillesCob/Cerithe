import {
  BedroomIcon,
  LivingRoomIcon,
  KitchenIcon,
  BathroomIcon,
  ShowerRoomIcon,
  WcIcon,
  OfficeIcon,
  EntranceIcon,
  HallwayIcon,
  GarageIcon,
  CellarIcon,
  AtticIcon,
  TerraceIcon,
  BalconyIcon,
  GardenIcon,
  DressingRoomIcon,
  StorageRoomIcon,
  LaundryRoomIcon,
  OtherRoomIcon,
  TechnicalRoomIcon,
} from "./roomTypeIcons";
import type { RoomType } from "@/types/room";

// Icones + labels hardcodes en front (decision du 13/08, cf suivi.html) : pas de table de reference
// en base, coherent avec l'enum Prisma en dur cote back (roomType). Une seule source pour ce mapping,
// reutilisee par RoomTypeSelector, AddRoomsModal, RoomPage et PropertyPage (regroupement par piece).
// Icones tracees a l'identique des mockups (roomTypeIcons.tsx), pas des icones lucide-react choisies
// par proximite semantique (ecart trouve et corrige le 13/08, cf suivi.html).
export const ROOM_TYPE_CONFIG: Record<RoomType, { label: string; icon: typeof BedroomIcon; group: "Espaces courants" | "Annexes" | "Autre" }> = {
  BEDROOM: { label: "Chambre", icon: BedroomIcon, group: "Espaces courants" },
  LIVING_ROOM: { label: "Salon", icon: LivingRoomIcon, group: "Espaces courants" },
  KITCHEN: { label: "Cuisine", icon: KitchenIcon, group: "Espaces courants" },
  BATHROOM: { label: "Salle de bain", icon: BathroomIcon, group: "Espaces courants" },
  SHOWER_ROOM: { label: "Salle d'eau", icon: ShowerRoomIcon, group: "Espaces courants" },
  WC: { label: "WC", icon: WcIcon, group: "Espaces courants" },
  OFFICE: { label: "Bureau", icon: OfficeIcon, group: "Espaces courants" },
  ENTRANCE: { label: "Entrée", icon: EntranceIcon, group: "Espaces courants" },
  HALLWAY: { label: "Couloir", icon: HallwayIcon, group: "Espaces courants" },
  GARAGE: { label: "Garage", icon: GarageIcon, group: "Annexes" },
  CELLAR: { label: "Cave", icon: CellarIcon, group: "Annexes" },
  ATTIC: { label: "Grenier", icon: AtticIcon, group: "Annexes" },
  TERRACE: { label: "Terrasse", icon: TerraceIcon, group: "Annexes" },
  BALCONY: { label: "Balcon", icon: BalconyIcon, group: "Annexes" },
  GARDEN: { label: "Jardin", icon: GardenIcon, group: "Annexes" },
  DRESSING_ROOM: { label: "Dressing", icon: DressingRoomIcon, group: "Annexes" },
  STORAGE_ROOM: { label: "Cellier", icon: StorageRoomIcon, group: "Annexes" },
  LAUNDRY_ROOM: { label: "Buanderie", icon: LaundryRoomIcon, group: "Annexes" },
  OTHER: { label: "Autre", icon: OtherRoomIcon, group: "Autre" },
  TECHNICAL_ROOM: { label: "Local technique", icon: TechnicalRoomIcon, group: "Autre" },
};

export const ROOM_TYPE_GROUPS = ["Espaces courants", "Annexes", "Autre"] as const;
