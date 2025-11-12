/*
  Warnings:

  - You are about to drop the column `isDefault` on the `ProductAttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `ProductSkuAttributeValue` table. All the data in the column will be lost.
  - Made the column `mainImage` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "mainImage" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductAttributeValue" DROP COLUMN "isDefault";

-- AlterTable
ALTER TABLE "ProductSku" ADD COLUMN     "isDefault" BOOLEAN;

-- AlterTable
ALTER TABLE "ProductSkuAttributeValue" DROP COLUMN "label";
