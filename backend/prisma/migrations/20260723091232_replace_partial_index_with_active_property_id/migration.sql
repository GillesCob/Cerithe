-- DropIndex
-- Résidu de la tentative précédente (index unique partiel Postgres déclaré via @@unique(... where: raw(...)),
-- abandonnée car fonctionnalité preview Prisma buguée sur le diff des index partiels avec IN sur un enum).
-- Non détecté automatiquement par `prisma migrate diff` : sans previewFeatures = ["partialIndexes"] dans le
-- schéma, le differ n'introspecte plus les index partiels et ne propose donc pas ce DROP, ajouté ici à la main.
DROP INDEX "one_active_transmission_per_property";

-- AlterTable
ALTER TABLE "TransmissionToken" ADD COLUMN     "activePropertyId" TEXT;

-- Backfill : les transmissions déjà actives (pending/clicked/accepted) doivent porter leur propertyId
-- dans activePropertyId avant la création de la contrainte unique, sinon la contrainte prendrait effet
-- sans que l'état déjà actif en base ne soit reflété. Règle métier non déductible d'un diff de schéma,
-- ajoutée ici à la main.
UPDATE "TransmissionToken" SET "activePropertyId" = "propertyId" WHERE status IN ('pending', 'clicked', 'accepted');

-- CreateIndex
CREATE UNIQUE INDEX "TransmissionToken_activePropertyId_key" ON "TransmissionToken"("activePropertyId");
