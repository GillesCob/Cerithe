/*
  Warnings:

  - Added the required column `level` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "roomType" ADD VALUE 'BATHROOM';
ALTER TYPE "roomType" ADD VALUE 'SHOWER_ROOM';
ALTER TYPE "roomType" ADD VALUE 'WC';
ALTER TYPE "roomType" ADD VALUE 'OFFICE';
ALTER TYPE "roomType" ADD VALUE 'ENTRANCE';
ALTER TYPE "roomType" ADD VALUE 'HALLWAY';
ALTER TYPE "roomType" ADD VALUE 'GARAGE';
ALTER TYPE "roomType" ADD VALUE 'CELLAR';
ALTER TYPE "roomType" ADD VALUE 'ATTIC';
ALTER TYPE "roomType" ADD VALUE 'TERRACE';
ALTER TYPE "roomType" ADD VALUE 'BALCONY';
ALTER TYPE "roomType" ADD VALUE 'GARDEN';
ALTER TYPE "roomType" ADD VALUE 'DRESSING_ROOM';
ALTER TYPE "roomType" ADD VALUE 'STORAGE_ROOM';
ALTER TYPE "roomType" ADD VALUE 'LAUNDRY_ROOM';
ALTER TYPE "roomType" ADD VALUE 'TECHNICAL_ROOM';
ALTER TYPE "roomType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "numberOfBasementLevels" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "level" INTEGER NOT NULL,
ALTER COLUMN "surface" DROP NOT NULL,
ALTER COLUMN "floorFinition" DROP NOT NULL,
ALTER COLUMN "wallFinition" DROP NOT NULL,
ALTER COLUMN "ceilingFinition" DROP NOT NULL;
