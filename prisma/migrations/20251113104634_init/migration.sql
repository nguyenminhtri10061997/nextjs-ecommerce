/*
  Warnings:

  - A unique constraint covering the columns `[optionId,name]` on the table `OptionItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[optionId,slug]` on the table `OptionItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OptionItem_optionId_name_key" ON "OptionItem"("optionId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "OptionItem_optionId_slug_key" ON "OptionItem"("optionId", "slug");
