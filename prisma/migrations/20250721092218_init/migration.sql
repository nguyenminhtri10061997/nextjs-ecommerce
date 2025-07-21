/*
  Warnings:

  - The values [SELECT] on the enum `EAttributeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EAttributeType_new" AS ENUM ('RADIO', 'COLOR');
ALTER TABLE "Attribute" ALTER COLUMN "type" TYPE "EAttributeType_new" USING ("type"::text::"EAttributeType_new");
ALTER TABLE "ProductAttribute" ALTER COLUMN "type" TYPE "EAttributeType_new" USING ("type"::text::"EAttributeType_new");
ALTER TYPE "EAttributeType" RENAME TO "EAttributeType_old";
ALTER TYPE "EAttributeType_new" RENAME TO "EAttributeType";
DROP TYPE "EAttributeType_old";
COMMIT;
