-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "tags" JSONB NOT NULL DEFAULT '[]';
