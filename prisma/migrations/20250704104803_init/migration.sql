/*
  Warnings:

  - You are about to drop the `ProductStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductToProductStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TagDisplayType" AS ENUM ('TEXT_IMAGE', 'IMAGE_ONLY', 'TEXT_BACKGROUND');

-- DropForeignKey
ALTER TABLE "ProductToProductStatus" DROP CONSTRAINT "ProductToProductStatus_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductToProductStatus" DROP CONSTRAINT "ProductToProductStatus_productStatusId_fkey";

-- DropTable
DROP TABLE "ProductStatus";

-- DropTable
DROP TABLE "ProductToProductStatus";

-- CreateTable
CREATE TABLE "ProductTag" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "expiredAfterDays" INTEGER,
    "displayType" "TagDisplayType" NOT NULL,
    "image" TEXT,
    "bgColor" TEXT,
    "textColor" TEXT,
    "displayOrder" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductToProductTag" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productTagId" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductToProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTag_code_key" ON "ProductTag"("code");

-- AddForeignKey
ALTER TABLE "ProductToProductTag" ADD CONSTRAINT "ProductToProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductToProductTag" ADD CONSTRAINT "ProductToProductTag_productTagId_fkey" FOREIGN KEY ("productTagId") REFERENCES "ProductTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
