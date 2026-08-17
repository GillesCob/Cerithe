// Icones des types de pieces, tracees a l'identique des SVG valides dans les mockups (13/08, cf
// mockups/modale-ajout-pieces-peuple.html) : ce ne sont PAS des icones lucide-react (les mockups ont
// ete dessines a la main, meme style visuel mais tracés différents), reprendre un nom lucide
// "semantiquement proche" ne suffit pas a respecter le mockup valide.

type IconShape =
  | { tag: "path"; d: string }
  | { tag: "rect"; x: number; y: number; width: number; height: number; rx?: number }
  | { tag: "circle"; cx: number; cy: number; r: number };

export interface IRoomIconProps {
  size?: number;
  className?: string;
}

const makeRoomIcon = (shapes: IconShape[]) => {
  const RoomIcon = ({ size = 19, className }: IRoomIconProps) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {shapes.map((shape, i) => {
        if (shape.tag === "path") return <path key={i} d={shape.d} />;
        if (shape.tag === "rect")
          return <rect key={i} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />;
        return <circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} />;
      })}
    </svg>
  );
  return RoomIcon;
};

export const BedroomIcon = makeRoomIcon([
  { tag: "path", d: "M2 19v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6" },
  { tag: "path", d: "M2 19v2M22 19v2" },
  { tag: "rect", x: 4, y: 7, width: 6, height: 4, rx: 1 },
  { tag: "path", d: "M2 15h20" },
]);

export const LivingRoomIcon = makeRoomIcon([
  { tag: "path", d: "M5 12V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" },
  { tag: "path", d: "M3 12h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  { tag: "path", d: "M5 18v2M19 18v2" },
]);

export const KitchenIcon = makeRoomIcon([
  { tag: "circle", cx: 10, cy: 12, r: 6 },
  { tag: "path", d: "M16 12h6" },
]);

export const BathroomIcon = makeRoomIcon([
  { tag: "path", d: "M3 12h15a3 3 0 0 1 3 3 6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z" },
  { tag: "path", d: "M3 12V8a2 2 0 0 1 2-2" },
  { tag: "path", d: "M7 21v1M17 21v1" },
]);

export const ShowerRoomIcon = makeRoomIcon([
  { tag: "rect", x: 7, y: 3, width: 10, height: 4, rx: 2 },
  { tag: "path", d: "M9 10v2M12 10v3M15 10v2" },
]);

export const WcIcon = makeRoomIcon([
  { tag: "rect", x: 8, y: 4, width: 8, height: 4, rx: 1 },
  { tag: "path", d: "M7 11h10a1 1 0 0 1 1 1 6 7 0 0 1-6 7 6 7 0 0 1-6-7 1 1 0 0 1 1-1z" },
]);

export const OfficeIcon = makeRoomIcon([
  { tag: "rect", x: 8, y: 3, width: 8, height: 6, rx: 1 },
  { tag: "path", d: "M12 9v3" },
  { tag: "path", d: "M3 18h18" },
  { tag: "path", d: "M3 18v3M21 18v3" },
]);

export const EntranceIcon = makeRoomIcon([
  { tag: "rect", x: 8, y: 3, width: 10, height: 18, rx: 1 },
  { tag: "circle", cx: 14, cy: 12, r: 1 },
  { tag: "path", d: "M2 12h5" },
  { tag: "path", d: "M4.5 9.5 2 12l2.5 2.5" },
]);

export const HallwayIcon = makeRoomIcon([
  { tag: "path", d: "M5 21 9 3M19 21 15 3" },
  { tag: "path", d: "M12 8v9" },
  { tag: "path", d: "M9 14l3 3 3-3" },
]);

export const GarageIcon = makeRoomIcon([
  { tag: "path", d: "M3 10 12 3l9 7" },
  { tag: "rect", x: 3, y: 10, width: 18, height: 11, rx: 1 },
  { tag: "path", d: "M3 14h18M3 18h18" },
]);

export const CellarIcon = makeRoomIcon([{ tag: "path", d: "M3 20V16h4v-4h4v-4h4V4h6" }]);

export const AtticIcon = makeRoomIcon([
  { tag: "path", d: "M3 13 12 4l9 9" },
  { tag: "path", d: "M6 13v8h12v-8" },
  { tag: "path", d: "M10 21v-5h4v5" },
]);

export const TerraceIcon = makeRoomIcon([
  { tag: "circle", cx: 12, cy: 7, r: 3 },
  { tag: "path", d: "M12 2v1.2M12 10.8V12M6.3 4.3l.9.9M17.7 4.3l-.9.9" },
  { tag: "path", d: "M3 21h18" },
]);

export const BalconyIcon = makeRoomIcon([
  { tag: "path", d: "M3 21V10M21 21V10M3 10h18" },
  { tag: "path", d: "M7 10v11M11 10v11M15 10v11" },
]);

export const GardenIcon = makeRoomIcon([
  { tag: "path", d: "M6 21c0-8 4-14 12-16-2 8-6 12-12 16z" },
  { tag: "path", d: "M6 21c2-4 5-7 9-9" },
]);

export const DressingRoomIcon = makeRoomIcon([
  { tag: "circle", cx: 12, cy: 4, r: 1.3 },
  { tag: "path", d: "M12 5.3v1.2" },
  { tag: "path", d: "M4 16l8-6 8 6" },
  { tag: "path", d: "M4 16h16" },
]);

export const StorageRoomIcon = makeRoomIcon([
  { tag: "rect", x: 3, y: 3, width: 18, height: 18, rx: 1 },
  { tag: "path", d: "M3 10h18M3 16h18" },
  { tag: "circle", cx: 7, cy: 6.5, r: 1.2 },
  { tag: "circle", cx: 11, cy: 6.5, r: 1.2 },
]);

export const LaundryRoomIcon = makeRoomIcon([
  { tag: "rect", x: 4, y: 3, width: 16, height: 18, rx: 2 },
  { tag: "path", d: "M8 6h2" },
  { tag: "circle", cx: 12, cy: 14, r: 4.5 },
]);

export const OtherRoomIcon = makeRoomIcon([
  { tag: "circle", cx: 6, cy: 12, r: 1.3 },
  { tag: "circle", cx: 12, cy: 12, r: 1.3 },
  { tag: "circle", cx: 18, cy: 12, r: 1.3 },
]);

export const TechnicalRoomIcon = makeRoomIcon([
  { tag: "circle", cx: 12, cy: 12, r: 3 },
  { tag: "path", d: "M12 3v3M12 18v3M21 12h-3M6 12H3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" },
]);
