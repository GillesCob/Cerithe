-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";
ALTER TABLE "Property" DROP CONSTRAINT "Property_profileId_fkey";
ALTER TABLE "Transmission" DROP CONSTRAINT "Transmission_previousOwnerId_fkey";
ALTER TABLE "Transmission" DROP CONSTRAINT "Transmission_newOwnerId_fkey";

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transmission" ADD CONSTRAINT "Transmission_previousOwnerId_fkey" FOREIGN KEY ("previousOwnerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transmission" ADD CONSTRAINT "Transmission_newOwnerId_fkey" FOREIGN KEY ("newOwnerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
