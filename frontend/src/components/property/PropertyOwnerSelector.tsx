import { useEffect, useRef, useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import type { IProfile } from "@/types/profile";
import { roleLabel, displayName } from "@/utils/profileDisplay";

interface IPropertyOwnerSelectorProps {
  profiles: IProfile[];
  value: string;
  onChange: (profileId: string) => void;
}

// Choix du nouveau propriétaire d'un bien (v1.5.0), reste local au formulaire
// jusqu'au clic sur "Valider" (cf Spec 2.1) : ce composant ne fait aucun appel
// API lui-même, seul le formulaire parent orchestre la soumission.
const PropertyOwnerSelector = ({ profiles, value, onChange }: IPropertyOwnerSelectorProps) => {
  // Une seule zone ouverte a la fois (menu ou info) : cf regle generale sur les
  // popovers a clic dans ~/.claude/CLAUDE.md.
  const [openZone, setOpenZone] = useState<"menu" | "info" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = profiles.find((p) => p.id === value) ?? profiles[0];
  const others = profiles.filter((p) => p.id !== selected?.id);

  useEffect(() => {
    if (!openZone) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenZone(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openZone]);

  if (!selected) return null;

  return (
    <div ref={containerRef}>
      <span className="flex items-center gap-1.5 text-[12.5px] text-gray-500 mb-1.5">
        Propriétaire
        <span className="relative">
          <button
            type="button"
            onClick={() => setOpenZone((z) => (z === "info" ? null : "info"))}
            aria-label="En savoir plus sur le changement de propriétaire"
            className="w-3.5 h-3.5 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center hover:text-gray-600 hover:border-gray-400"
          >
            <Info size={9} />
          </button>
          {openZone === "info" && (
            <div className="absolute top-[calc(100%+6px)] left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 text-[12px] leading-relaxed text-gray-600 normal-case z-20">
              Ce bien apparaitra dans la liste des biens du profil sélectionné.
            </div>
          )}
        </span>
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenZone((z) => (z === "menu" ? null : "menu"))}
          className="flex items-center gap-2 w-full pl-2 pr-3 py-2 rounded-lg border border-gray-200 bg-white"
        >
          <span className="w-6.5 h-6.5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
            {displayName(selected).charAt(0).toUpperCase()}
          </span>
          <span className="flex flex-col items-start leading-tight flex-1 text-left">
            <span className="text-[13.5px] font-medium text-gray-900">{displayName(selected)}</span>
            <span className="text-[11.5px] text-gray-600">{roleLabel(selected.role)}</span>
          </span>
          <ChevronDown className={`size-3.5 text-gray-400 transition-transform ${openZone === "menu" ? "rotate-180" : ""}`} />
        </button>

        {openZone === "menu" && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 z-20">
            {others.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  onChange(profile.id);
                  setOpenZone(null);
                }}
                className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-gray-50 text-left"
              >
                <span className="w-6.5 h-6.5 rounded-full border-1.5 border-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center shrink-0">
                  {displayName(profile).charAt(0).toUpperCase()}
                </span>
                <span>
                  <span className="block text-[13.5px] font-semibold text-gray-900">{displayName(profile)}</span>
                  <span className="block text-[11.5px] text-gray-600">{roleLabel(profile.role)}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyOwnerSelector;
