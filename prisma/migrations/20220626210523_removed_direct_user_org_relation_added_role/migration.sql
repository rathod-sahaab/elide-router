/*
  Warnings:

  - You are about to drop the column `organisationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organisationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organisationId";

-- AlterTable
ALTER TABLE "UsersOnOrganisations" ADD COLUMN     "role" "OrganisationMemberRole" NOT NULL DEFAULT E'VIEWER';
