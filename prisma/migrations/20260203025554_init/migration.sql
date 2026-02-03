/*
  Warnings:

  - You are about to drop the column `keyPoints` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "keyPoints",
DROP COLUMN "summary",
ADD COLUMN     "subtitle" TEXT;
