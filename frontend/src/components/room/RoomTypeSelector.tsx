import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ROOM_TYPE_CONFIG, ROOM_TYPE_GROUPS } from "./roomTypeConfig";
import type { RoomType } from "@/types/room";

interface IRoomTypeSelectorProps {
  value: RoomType;
  onConfirm: (roomType: RoomType) => void;
  onClose: () => void;
}

// Modale de selection unique du type d'une piece existante (Formulaire 4). Reutilise le meme
// referentiel de types (ROOM_TYPE_CONFIG) que la grille de la modale d'ajout, cf roomTypeConfig.ts.
const RoomTypeSelector = ({ value, onConfirm, onClose }: IRoomTypeSelectorProps) => {
  const [selected, setSelected] = useState<RoomType>(value);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Type de la pièce</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-gray-400 -mt-2">
          Un seul type possible par pièce. Sélectionner une nouvelle tuile remplace le type actuel.
        </p>
        <div className="max-h-[50vh] overflow-y-auto flex flex-col gap-3">
          {ROOM_TYPE_GROUPS.map((group) => (
            <details key={group} open={group === ROOM_TYPE_CONFIG[selected].group}>
              <summary className="cursor-pointer text-[11.5px] font-semibold uppercase tracking-wide text-gray-500 py-1">
                {group}
              </summary>
              <div className="grid grid-cols-4 gap-1.5 pt-1.5">
                {(Object.entries(ROOM_TYPE_CONFIG) as [RoomType, (typeof ROOM_TYPE_CONFIG)[RoomType]][])
                  .filter(([, config]) => config.group === group)
                  .map(([type, config]) => {
                    const Icon = config.icon;
                    const isSelected = selected === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelected(type)}
                        className={`relative flex flex-col items-center gap-1 border rounded-lg py-2.5 px-1 text-center ${
                          isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center">
                            ✓
                          </span>
                        )}
                        <Icon size={19} className={isSelected ? "text-blue-600" : "text-gray-500"} />
                        <span className="text-[10.5px] text-gray-900 leading-tight">{config.label}</span>
                      </button>
                    );
                  })}
              </div>
            </details>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => onConfirm(selected)}>Valider</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomTypeSelector;
