-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "pricePaid" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCode" TEXT;
