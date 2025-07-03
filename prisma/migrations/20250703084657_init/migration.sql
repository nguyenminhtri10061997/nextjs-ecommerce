-- AlterTable
ALTER TABLE "ProductRating" ALTER COLUMN "isVerify" SET DEFAULT false,
ALTER COLUMN "verifyBy" DROP NOT NULL;
