import { asClass, asValue, createContainer } from "awilix";
import { PrismaClient } from "@prisma/client";
import { TodoPrismaRepository } from "./infrastructure/repositories/TodoPrismaRepository";
import { TodoListPrismaRepository } from "./infrastructure/repositories/TodoListPrismaRepository";
import { FetchTodoListPrismaQuery } from "~/infrastructure/queries/FetchTodoListPrismaQuery";

export const container = createContainer();

container.register({
  prisma: asValue(new PrismaClient()),
  todos: asClass(TodoPrismaRepository).singleton(),
  todoLists: asClass(TodoListPrismaRepository).singleton(),
  fetchTodoList: asClass(FetchTodoListPrismaQuery).singleton(),
});
