-- CreateTable
CREATE TABLE "TodoListPermission" (
    "todoListId" UUID NOT NULL,
    "ownerId" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TodoListPermission_todoListId_key" ON "TodoListPermission"("todoListId");

INSERT INTO "TodoListPermission" ("todoListId", "ownerId")
SELECT "id", "ownerId" FROM "TodoList";