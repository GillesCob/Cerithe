// Retire les cles a valeur undefined d'un objet avant de le passer a Prisma. Necessaire car
// exactOptionalPropertyTypes (tsconfig) distingue une cle absente d'une cle presente valant
// undefined : un objet infere par Zod (`.optional()` -> `T | undefined`) n'est jamais directement
// assignable aux types Prisma (`T` sur cle optionnelle, sans undefined explicite) sans ce passage.
export const omitUndefined = <T extends Record<string, unknown>>(obj: T) => {
  const entries = Object.entries(obj).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries) as { [K in keyof T]?: Exclude<T[K], undefined> };
};
