-- CreateTable
CREATE TABLE "Todo" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL,
    "todoListId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoList" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "TodoList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_todoListId_fkey" FOREIGN KEY ("todoListId") REFERENCES "TodoList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
