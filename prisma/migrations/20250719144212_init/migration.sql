/*
  Warnings:

  - The values [EXTERNAL,DIGITAL] on the enum `EStockType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isActive` on the `ProductSku` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,name]` on the table `ProductAttribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productAttributeId,name]` on the table `ProductAttributeValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,productTagId]` on the table `ProductToProductTag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ProductAttribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ProductAttributeValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ProductSku` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EProductType" AS ENUM ('SIMPLE', 'VARIABLE', 'DIGITAL', 'SERVICE');

-- CreateEnum
CREATE TYPE "ESkuStatus" AS ENUM ('ACTIVE', 'INACTIVE_BY_ADMIN', 'DELETED');

-- CreateEnum
CREATE TYPE "EAttributeStatus" AS ENUM ('ACTIVE', 'INACTIVE_BY_ADMIN', 'DELETED');

-- CreateEnum
CREATE TYPE "EAttributeValueStatus" AS ENUM ('ACTIVE', 'INACTIVE_BY_ADMIN', 'DELETED');

-- AlterEnum
BEGIN;
CREATE TYPE "EStockType_new" AS ENUM ('SKU', 'ATTRIBUTE');
ALTER TABLE "ProductSku" ALTER COLUMN "stockType" TYPE "EStockType_new" USING ("stockType"::text::"EStockType_new");
ALTER TYPE "EStockType" RENAME TO "EStockType_old";
ALTER TYPE "EStockType_new" RENAME TO "EStockType";
DROP TYPE "EStockType_old";
COMMIT;

-- DropIndex
DROP INDEX "ProductSku_sellerSku_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "type" "EProductType" NOT NULL;

-- AlterTable
ALTER TABLE "ProductAttribute" ADD COLUMN     "status" "EAttributeStatus" NOT NULL;

-- AlterTable
ALTER TABLE "ProductAttributeValue" ADD COLUMN     "status" "EAttributeValueStatus" NOT NULL;

-- AlterTable
ALTER TABLE "ProductSku" DROP COLUMN "isActive",
ADD COLUMN     "status" "ESkuStatus" NOT NULL;

-- AlterTable
ALTER TABLE "ProductToOption" ALTER COLUMN "maxSelect" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_productId_name_key" ON "ProductAttribute"("productId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeValue_productAttributeId_name_key" ON "ProductAttributeValue"("productAttributeId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductToProductTag_productId_productTagId_key" ON "ProductToProductTag"("productId", "productTagId");
