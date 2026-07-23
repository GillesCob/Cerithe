-- CreateIndex
CREATE UNIQUE INDEX "one_active_transmission_per_property" ON "TransmissionToken"("propertyId") WHERE (status IN ('pending', 'clicked', 'accepted'));
