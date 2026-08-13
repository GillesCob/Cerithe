// numberOfLevels compte les niveaux hors-sol en partant du RDC (niveau 0) : numberOfLevels=2
// -> niveaux 0 (RDC) et 1 (+1), cf mockup bien-apres-pieces.html (13/08). numberOfBasementLevels
// plafonne a 1 (cf suivi.html v1.6.0) : au plus le niveau -1.
export const getPropertyLevels = (property: { numberOfLevels: number; numberOfBasementLevels: number }): number[] => {
  const basementLevels = Array.from({ length: property.numberOfBasementLevels }, (_, i) => -(property.numberOfBasementLevels - i));
  const aboveLevels = Array.from({ length: property.numberOfLevels }, (_, i) => i);
  return [...basementLevels, ...aboveLevels];
};

// Libelles alignes sur les headers "-1" / "Rez-de-chaussée" / "+1" des mockups, pas "Niveau X".
export const levelLabel = (level: number) => {
  if (level === 0) return "Rez-de-chaussée";
  return level < 0 ? `${level}` : `+${level}`;
};
