-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL,
    "todoListId" TEXT NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoList" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "TodoList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "TodoList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
