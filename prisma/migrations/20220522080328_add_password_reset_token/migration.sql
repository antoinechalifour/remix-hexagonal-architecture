-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "passwordResetExpiration" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
