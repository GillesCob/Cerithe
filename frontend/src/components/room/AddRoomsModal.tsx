import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { isAxiosError } from "axios";
import { ROOM_TYPE_CONFIG, ROOM_TYPE_GROUPS } from "./roomTypeConfig";
import { getPropertyLevels, levelLabel } from "@/utils/propertyLevels";
import { useCreateRooms } from "@/hooks/useRoom";
import { useUpdateProperty } from "@/hooks/useProperty";
import type { IProperty } from "@/types/property";
import type { RoomType } from "@/types/room";

interface IAddRoomsModalProps {
  property: IProperty;
  onClose: () => void;
}

const selectionKey = (level: number, roomType: RoomType) => `${level}:${roomType}`;

// Grille de tuiles par niveau (une details/type-group par groupe), quantite editable par tuile,
// cf mockups modale-ajout-pieces-{vide,peuple}.html. Les 2 boutons d'ajout de niveau appellent
// updateProperty sans fermer la modale (endpoint 2, cf suivi.html) : le prop "property" vient de
// PropertyPage et se met a jour automatiquement via l'invalidation TanStack Query.
const AddRoomsModal = ({ property, onClose }: IAddRoomsModalProps) => {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Un groupe ouvert par niveau, independamment des autres niveaux (17/08, corrige la portee
  // globale d'origine, cf suivi.html v1.6.1 #3) : cle = niveau, valeur = nom du groupe ouvert (ou
  // null si ferme). Un niveau absent de la map affiche le 1er groupe ouvert par defaut, calcule a
  // chaque rendu (jamais fige au montage), ce qui resout aussi l'instabilite #13 (meme cause racine).
  const [openGroupByLevel, setOpenGroupByLevel] = useState<Record<number, string | null>>({});
  const { mutate: createRooms, isPending: isCreating } = useCreateRooms();
  const { mutate: updateProperty, isPending: isAddingLevel } = useUpdateProperty();

  const levels = getPropertyLevels(property);
  const existingRooms = property.room ?? [];

  const existingCount = (level: number, roomType: RoomType) =>
    existingRooms.filter((room) => room.level === level && room.roomType === roomType).length;

  const groupExistingCount = (level: number, group: string) =>
    existingRooms.filter((room) => room.level === level && ROOM_TYPE_CONFIG[room.roomType]?.group === group).length;

  const isGroupOpen = (level: number, group: string) => {
    const current = level in openGroupByLevel ? openGroupByLevel[level] : ROOM_TYPE_GROUPS[0];
    return current === group;
  };

  const toggleGroup = (level: number, group: string) => {
    setOpenGroupByLevel((prev) => {
      const current = level in prev ? prev[level] : ROOM_TYPE_GROUPS[0];
      return { ...prev, [level]: current === group ? null : group };
    });
  };

  // Selections stockees en total cible (pas en delta), cf suivi.html v1.6.1 #4 : cliquer une tuile
  // deja existante affiche son total actuel plutot que de repartir de 1, le delta reel n'est
  // calcule qu'a la soumission (handleSubmit).
  const toggleTile = (level: number, roomType: RoomType) => {
    const key = selectionKey(level, roomType);
    setSelections((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = Math.max(1, existingCount(level, roomType));
      return next;
    });
  };

  const setQuantity = (level: number, roomType: RoomType, quantity: number) => {
    const key = selectionKey(level, roomType);
    const floor = Math.max(1, existingCount(level, roomType));
    setSelections((prev) => ({ ...prev, [key]: Math.max(floor, quantity) }));
  };

  const handleAddLevel = () => {
    updateProperty({ id: property.id, numberOfLevels: property.numberOfLevels + 1 });
  };

  const handleAddBasement = () => {
    updateProperty({ id: property.id, numberOfBasementLevels: 1 });
  };

  const handleSubmit = () => {
    // quantity stocke le total cible (cf toggleTile/setQuantity) : seul le delta avec l'existant
    // est reellement a creer, une tuile laissee a sa valeur initiale (delta 0) n'ajoute rien.
    const rooms = Object.entries(selections)
      .map(([key, quantity]) => {
        const [level, roomType] = key.split(":");
        const delta = quantity - existingCount(Number(level), roomType as RoomType);
        return { level: Number(level), roomType: roomType as RoomType, quantity: delta };
      })
      .filter((room) => room.quantity > 0);
    if (rooms.length === 0) return;
    setErrorMessage(null);
    createRooms(
      { propertyId: property.id, rooms },
      {
        onSuccess: onClose,
        onError: (error) => {
          setErrorMessage(isAxiosError(error) ? (error.response?.data?.message ?? "Erreur inconnue") : "Erreur inconnue");
        },
      },
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ajouter des pièces</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto overscroll-y-contain touch-pan-y flex flex-col gap-3.5">
          {property.numberOfBasementLevels === 0 && (
            <button
              type="button"
              onClick={handleAddBasement}
              disabled={isAddingLevel}
              className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            >
              + Ajouter un -1
            </button>
          )}

          {levels.map((level) => (
            <div key={level} className="border border-gray-200 rounded-xl p-3.5 pb-1">
              <p className="text-[13px] font-bold text-gray-900 mb-2.5">{levelLabel(level)}</p>
              {ROOM_TYPE_GROUPS.map((group) => {
                const groupOpen = isGroupOpen(level, group);
                const groupTotal = groupExistingCount(level, group);
                return (
                  <div key={group} className="mb-2.5">
                    <button
                      type="button"
                      onClick={() => toggleGroup(level, group)}
                      className="w-full flex items-center gap-1.5 text-left cursor-pointer text-[11.5px] font-semibold uppercase tracking-wide text-gray-500 py-1"
                    >
                      {group}
                      {groupTotal > 0 && (
                        <span className="bg-gray-200 text-gray-600 text-[9.5px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1 normal-case tracking-normal">
                          {groupTotal}
                        </span>
                      )}
                    </button>
                    {groupOpen && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1.5">
                        {(Object.entries(ROOM_TYPE_CONFIG) as [RoomType, (typeof ROOM_TYPE_CONFIG)[RoomType]][])
                          .filter(([, config]) => config.group === group)
                          .map(([type, config]) => {
                            const Icon = config.icon;
                            const key = selectionKey(level, type);
                            const quantity = selections[key];
                            const isSelected = !!quantity;
                            const existing = existingCount(level, type);
                            return (
                              <div
                                key={type}
                                onClick={() => toggleTile(level, type)}
                                className={`relative flex flex-col items-center gap-1 border rounded-lg py-2.5 px-1 text-center cursor-pointer min-h-[44px] ${
                                  isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                }`}
                              >
                                {existing > 0 && (
                                  <span className="absolute -top-1.5 -right-1.5 bg-gray-400 text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1">
                                    {existing}
                                  </span>
                                )}
                                <Icon size={19} className={isSelected ? "text-blue-600" : "text-gray-500"} />
                                <span className="text-[10.5px] text-gray-900 leading-tight">{config.label}</span>
                                {isSelected && (
                                  <div className="flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={() => setQuantity(level, type, quantity - 1)}
                                      className="w-6.5 h-6.5 rounded-md border-1.5 border-blue-600 text-blue-600 font-bold flex items-center justify-center"
                                    >
                                      −
                                    </button>
                                    <input
                                      type="number"
                                      min={1}
                                      value={quantity}
                                      onChange={(e) => setQuantity(level, type, Number(e.target.value) || 1)}
                                      className="w-8.5 py-1 border border-gray-200 rounded-md text-center text-sm font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setQuantity(level, type, quantity + 1)}
                                      className="w-6.5 h-6.5 rounded-md border-1.5 border-blue-600 text-blue-600 font-bold flex items-center justify-center"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddLevel}
            disabled={isAddingLevel}
            className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            + Ajouter le niveau +{property.numberOfLevels}
          </button>
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating || Object.keys(selections).length === 0}>
            {isCreating ? "Ajout..." : "Valider"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomsModal;
