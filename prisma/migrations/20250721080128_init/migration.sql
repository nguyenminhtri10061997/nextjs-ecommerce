/*
  Warnings:

  - The values [SKU] on the enum `EStockType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Label` on the `ProductSkuAttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `ProductSkuAttributeValue` table. All the data in the column will be lost.
  - Added the required column `type` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ProductAttribute` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EAttributeType" AS ENUM ('SELECT', 'COLOR');

-- AlterEnum
BEGIN;
CREATE TYPE "EStockType_new" AS ENUM ('INVENTORY', 'ATTRIBUTE', 'DIGITAL', 'MANUAL');
ALTER TABLE "ProductSku" ALTER COLUMN "stockType" TYPE "EStockType_new" USING ("stockType"::text::"EStockType_new");
ALTER TYPE "EStockType" RENAME TO "EStockType_old";
ALTER TYPE "EStockType_new" RENAME TO "EStockType";
DROP TYPE "EStockType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "type" "EAttributeType" NOT NULL;

-- AlterTable
ALTER TABLE "ProductAttribute" ADD COLUMN     "type" "EAttributeType" NOT NULL;

-- AlterTable
ALTER TABLE "ProductSku" ADD COLUMN     "downloadUrl" TEXT,
ADD COLUMN     "image" TEXT,
ALTER COLUMN "note" DROP NOT NULL,
ALTER COLUMN "isDefault" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductSkuAttributeValue" DROP COLUMN "Label",
DROP COLUMN "image",
ADD COLUMN     "label" TEXT;
