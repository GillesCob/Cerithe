-- CreateEnum
CREATE TYPE "transmissionStatus" AS ENUM ('pending', 'clicked', 'accepted', 'confirmed', 'cancelled', 'expired');

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_roomId_fkey";

-- DropForeignKey
ALTER TABLE "project_has_room" DROP CONSTRAINT "project_has_room_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_has_room" DROP CONSTRAINT "project_has_room_roomId_fkey";

-- CreateTable
CREATE TABLE "TransmissionToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "status" "transmissionStatus" NOT NULL DEFAULT 'pending',
    "clickedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "TransmissionToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransmissionToken_token_key" ON "TransmissionToken"("token");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransmissionToken" ADD CONSTRAINT "TransmissionToken_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_has_room" ADD CONSTRAINT "project_has_room_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_has_room" ADD CONSTRAINT "project_has_room_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
