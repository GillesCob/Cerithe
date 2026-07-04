-- AlterTable
ALTER TABLE "TransmissionToken" ADD COLUMN     "recipientProfileId" TEXT;

-- AddForeignKey
ALTER TABLE "TransmissionToken" ADD CONSTRAINT "TransmissionToken_recipientProfileId_fkey" FOREIGN KEY ("recipientProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
