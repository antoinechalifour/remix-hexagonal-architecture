-- AlterTable
ALTER TABLE "Todo" RENAME COLUMN "completedAt" TO "doneAt";
ALTER TABLE "Todo" RENAME COLUMN "isComplete" TO "isDone";

-- AlterTable
ALTER TABLE "TodoListPermission" RENAME COLUMN "collaboratorsIds" TO "contributorsIds";
