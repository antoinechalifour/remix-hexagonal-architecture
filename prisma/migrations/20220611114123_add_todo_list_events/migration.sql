-- CreateTable
CREATE TABLE "TodoListEvent" (
    "id" UUID NOT NULL,
    "todoListId" UUID NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "event" JSONB NOT NULL,

    CONSTRAINT "TodoListEvent_pkey" PRIMARY KEY ("id")
);
