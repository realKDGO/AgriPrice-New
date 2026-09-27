-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FARMER', 'MAO', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PriceStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(80) NOT NULL,
    "lastName" VARCHAR(80) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'FARMER',
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "termsVersion" TEXT NOT NULL DEFAULT '2026-09-11',
    "termsAcceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshSession" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "familyId" UUID NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "userId" UUID NOT NULL,
    "price" BOOLEAN NOT NULL DEFAULT true,
    "forecast" BOOLEAN NOT NULL DEFAULT true,
    "market" BOOLEAN NOT NULL DEFAULT true,
    "language" TEXT NOT NULL DEFAULT 'English',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "textSize" TEXT NOT NULL DEFAULT 'standard',
    "defaultCrop" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(30) NOT NULL,
    "unit" VARCHAR(10) NOT NULL DEFAULT 'kg',
    "imageUrl" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdBy" UUID,
    "updatedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "location" VARCHAR(200) NOT NULL,
    "distanceKm" DECIMAL(10,2),
    "transportBaseCost" DECIMAL(12,2) NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" UUID NOT NULL,
    "cropId" UUID NOT NULL,
    "marketId" UUID NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "previousPrice" DECIMAL(12,2),
    "date" DATE NOT NULL,
    "status" "PriceStatus" NOT NULL DEFAULT 'PENDING',
    "source" VARCHAR(200) NOT NULL,
    "reviewNote" VARCHAR(1000),
    "createdBy" UUID,
    "reviewedBy" UUID,
    "reviewedAt" TIMESTAMP(3),
    "revisionOfId" UUID,
    "supersededAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forecast" (
    "id" UUID NOT NULL,
    "cropId" UUID NOT NULL,
    "marketId" UUID NOT NULL,
    "horizonMonths" INTEGER NOT NULL,
    "forecastDate" DATE NOT NULL,
    "targetDate" DATE NOT NULL,
    "predictedPrice" DECIMAL(12,2) NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "inputCount" INTEGER NOT NULL,

    CONSTRAINT "Forecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "message" VARCHAR(5000) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "StorageCleanup" (
    "id" UUID NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StorageCleanup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshSession_tokenHash_key" ON "RefreshSession"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshSession_userId_revokedAt_idx" ON "RefreshSession"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "RefreshSession_familyId_idx" ON "RefreshSession"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "Crop_name_key" ON "Crop"("name");

-- CreateIndex
CREATE INDEX "Crop_status_category_idx" ON "Crop"("status", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Market_name_key" ON "Market"("name");

-- CreateIndex
CREATE INDEX "Market_status_idx" ON "Market"("status");

-- CreateIndex
CREATE INDEX "Price_cropId_marketId_date_idx" ON "Price"("cropId", "marketId", "date");

-- CreateIndex
CREATE INDEX "Price_status_date_idx" ON "Price"("status", "date");

-- CreateIndex
CREATE INDEX "Price_marketId_date_idx" ON "Price"("marketId", "date");

-- CreateIndex
CREATE INDEX "Price_revisionOfId_idx" ON "Price"("revisionOfId");

-- CreateIndex
CREATE INDEX "Forecast_cropId_marketId_generatedAt_idx" ON "Forecast"("cropId", "marketId", "generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Forecast_cropId_marketId_forecastDate_horizonMonths_modelVe_key" ON "Forecast"("cropId", "marketId", "forecastDate", "horizonMonths", "modelVersion");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StorageCleanup_imagePath_key" ON "StorageCleanup"("imagePath");

-- AddForeignKey
ALTER TABLE "RefreshSession" ADD CONSTRAINT "RefreshSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_revisionOfId_fkey" FOREIGN KEY ("revisionOfId") REFERENCES "Price"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forecast" ADD CONSTRAINT "Forecast_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Case-insensitive catalog/account names and one accepted quotation per market/date.
CREATE UNIQUE INDEX "Crop_name_ci" ON "Crop" (lower(btrim(name)));
CREATE UNIQUE INDEX "Market_name_ci" ON "Market" (lower(btrim(name)));
CREATE UNIQUE INDEX "User_email_ci" ON "User" (lower(email));
CREATE UNIQUE INDEX "Price_verified_slot" ON "Price" ("cropId", "marketId", date) WHERE status='VERIFIED' AND "supersededAt" IS NULL;
CREATE UNIQUE INDEX "Price_pending_revision" ON "Price" ("revisionOfId") WHERE status='PENDING' AND "revisionOfId" IS NOT NULL;
ALTER TABLE "Price" ADD CONSTRAINT "Price_positive" CHECK (price > 0);
ALTER TABLE "Market" ADD CONSTRAINT "Market_transport_nonnegative" CHECK ("transportBaseCost" >= 0);
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_image_required" CHECK (length("imageUrl") > 0 AND length("imagePath") > 0);
-- Private Prisma schema. The owner performs application queries; no client Data API access.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "User" FROM PUBLIC;
ALTER TABLE "RefreshSession" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "RefreshSession" FROM PUBLIC;
ALTER TABLE "UserPreference" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "UserPreference" FROM PUBLIC;
ALTER TABLE "Crop" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "Crop" FROM PUBLIC;
ALTER TABLE "Market" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "Market" FROM PUBLIC;
ALTER TABLE "Price" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "Price" FROM PUBLIC;
ALTER TABLE "Forecast" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "Forecast" FROM PUBLIC;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "Notification" FROM PUBLIC;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "AuditLog" FROM PUBLIC;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "ContactMessage" FROM PUBLIC;
ALTER TABLE "SystemSetting" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "SystemSetting" FROM PUBLIC;
ALTER TABLE "StorageCleanup" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "StorageCleanup" FROM PUBLIC;
