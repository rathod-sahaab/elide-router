-- DropIndex
DROP INDEX "OrganisationInvitation_userId_organisationId_status_key";

-- CreateIndex
CREATE INDEX "OrganisationInvitation_userId_organisationId_status_idx" ON "OrganisationInvitation"("userId", "organisationId", "status");
