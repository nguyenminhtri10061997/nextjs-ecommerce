-- CreateTable
CREATE TABLE "RetryError" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retryKey" TEXT,
    "funcName" TEXT,
    "args" JSONB,
    "message" TEXT,
    "stack" TEXT,
    "metadata" JSONB,

    CONSTRAINT "RetryError_pkey" PRIMARY KEY ("id")
);
