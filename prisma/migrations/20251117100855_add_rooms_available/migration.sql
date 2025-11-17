-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "roomsAvailable" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "specialRequests" TEXT;
