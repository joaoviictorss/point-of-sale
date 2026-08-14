-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sellerId" TEXT,
ADD COLUMN     "sellerName" TEXT;

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Seller_organizationId_active_idx" ON "Seller"("organizationId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_organizationId_code_key" ON "Seller"("organizationId", "code");

-- CreateIndex
CREATE INDEX "Order_organizationId_sellerId_idx" ON "Order"("organizationId", "sellerId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
