-- AlterTable
ALTER TABLE "TodoListPermission" ADD COLUMN     "collaboratorsIds" JSONB NOT NULL DEFAULT '[]';
