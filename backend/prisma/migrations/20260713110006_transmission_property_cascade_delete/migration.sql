-- DropForeignKey
ALTER TABLE "Transmission" DROP CONSTRAINT "Transmission_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "Transmission" ADD CONSTRAINT "Transmission_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
