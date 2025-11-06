/*
  Warnings:

  - You are about to drop the column `code` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_code_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "code";
