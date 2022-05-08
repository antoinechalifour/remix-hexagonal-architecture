/*
  Warnings:

  - Added the required column `todosOrder` to the `TodoList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TodoList" ADD COLUMN     "todosOrder" JSONB NOT NULL;
