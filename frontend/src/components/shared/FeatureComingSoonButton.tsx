import { useEffect, useRef, useState } from "react";

// Ferme le tooltip sur n'importe quel clic en dehors du bouton, pas seulement en recliquant
// dessus (mobile n'a pas de hover pour le fermer autrement). Partage entre PropertyPage et
// RoomPage (Pieces & travaux, Ajouter un projet), cf suivi.html.
const FeatureComingSoonButton = ({ label }: { label: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showTooltip) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showTooltip]);

  return (
    <div ref={containerRef} className="relative inline-block group">
      <button
        type="button"
        onClick={() => setShowTooltip((v) => !v)}
        className="cursor-pointer text-sm bg-gray-100 text-gray-400 px-4 py-2 rounded-lg"
      >
        {label}
      </button>
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-[9rem] text-center bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-lg pointer-events-none z-10 transition-opacity ${
          showTooltip ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-800 rotate-45" />
        En développement
      </div>
    </div>
  );
};

export default FeatureComingSoonButton;
