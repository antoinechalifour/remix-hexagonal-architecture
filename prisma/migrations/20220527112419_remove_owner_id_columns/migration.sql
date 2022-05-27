/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `TodoList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "TodoList" DROP COLUMN "ownerId";
