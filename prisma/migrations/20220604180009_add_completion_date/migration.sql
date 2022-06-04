-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "completedAt" TIMESTAMP(3);
UPDATE "Todo" SET "completedAt" = now() WHERE "isComplete" IS true;