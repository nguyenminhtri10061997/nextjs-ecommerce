/*
  Warnings:

  - The values [PRODUCT_OPTION] on the enum `EPermissionResource` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ProductOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductOptionItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductToProductOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EOptionContext" AS ENUM ('PRODUCT');

-- AlterEnum
BEGIN;
CREATE TYPE "EPermissionResource_new" AS ENUM ('USER', 'ROLE', 'PERMISSION', 'PRODUCT', 'BRAND', 'LANGUAGE', 'PRODUCT_CATEGORY', 'ATTRIBUTE', 'OPTION', 'PRODUCT_STATUS', 'PRODUCT_RATING', 'PRODUCT_TAG');
ALTER TABLE "Permission" ALTER COLUMN "resource" TYPE "EPermissionResource_new" USING ("resource"::text::"EPermissionResource_new");
ALTER TYPE "EPermissionResource" RENAME TO "EPermissionResource_old";
ALTER TYPE "EPermissionResource_new" RENAME TO "EPermissionResource";
DROP TYPE "EPermissionResource_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ProductOptionItem" DROP CONSTRAINT "ProductOptionItem_productOptionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductToProductOption" DROP CONSTRAINT "ProductToProductOption_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductToProductOption" DROP CONSTRAINT "ProductToProductOption_productOptionId_fkey";

-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN     "displayOrder" INTEGER;

-- DropTable
DROP TABLE "ProductOption";

-- DropTable
DROP TABLE "ProductOptionItem";

-- DropTable
DROP TABLE "ProductToProductOption";

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "context" "EOptionContext" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionItem" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductToOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "displayOrder" INTEGER,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "maxSelect" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductToOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductToOptionToOptionItem" (
    "id" TEXT NOT NULL,
    "productToOptionId" TEXT NOT NULL,
    "optionItemId" TEXT NOT NULL,
    "displayOrder" INTEGER,
    "priceModifierType" "EPriceModifierType" NOT NULL,
    "priceModifierValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductToOptionToOptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Option_name_key" ON "Option"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Option_slug_key" ON "Option"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductToOption_productId_optionId_key" ON "ProductToOption"("productId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductToOptionToOptionItem_productToOptionId_optionItemId_key" ON "ProductToOptionToOptionItem"("productToOptionId", "optionItemId");

-- AddForeignKey
ALTER TABLE "OptionItem" ADD CONSTRAINT "OptionItem_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductToOption" ADD CONSTRAINT "ProductToOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductToOption" ADD CONSTRAINT "ProductToOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductToOptionToOptionItem" ADD CONSTRAINT "ProductToOptionToOptionItem_optionItemId_fkey" FOREIGN KEY ("optionItemId") REFERENCES "OptionItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductToOptionToOptionItem" ADD CONSTRAINT "ProductToOptionToOptionItem_productToOptionId_fkey" FOREIGN KEY ("productToOptionId") REFERENCES "ProductToOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
