-- DropIndex
DROP INDEX IF EXISTS "users_id_idx";

-- DropIndex
DROP INDEX IF EXISTS "user_profiles_userId_idx";

-- CreateIndex
CREATE INDEX "venues_status_idx" ON "venues"("status");

-- CreateIndex
CREATE INDEX "fields_status_idx" ON "fields"("status");

-- CreateIndex
CREATE INDEX "fields_sport_type_id_idx" ON "fields"("sport_type_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");
