import { asClass, asValue, createContainer } from "awilix";
import { PrismaClient } from "@prisma/client";
import { TodoPrismaRepository } from "./infrastructure/repositories/TodoPrismaRepository";
import { TodoListPrismaRepository } from "./infrastructure/repositories/TodoListPrismaRepository";
import { FetchTodoListPrismaQuery } from "~/infrastructure/queries/FetchTodoListPrismaQuery";
import { AddTodoList } from "~/domain/AddTodoList";
import { AddTodo } from "~/domain/AddTodo";
import { ChangeTodoCompletion } from "~/domain/ChangeTodoCompletion";
import { ArchiveTodo } from "~/domain/ArchiveTodo";
import { ArchiveTodoList } from "~/domain/ArchiveTodoList";

export const container = createContainer();

container.register({
  addTodoList: asClass(AddTodoList).singleton(),
  addTodo: asClass(AddTodo).singleton(),
  archiveTodoList: asClass(ArchiveTodoList).singleton(),
  archiveTodo: asClass(ArchiveTodo).singleton(),
  changeTodoCompletion: asClass(ChangeTodoCompletion).singleton(),
  prisma: asValue(new PrismaClient()),
  todos: asClass(TodoPrismaRepository).singleton(),
  todoLists: asClass(TodoListPrismaRepository).singleton(),
  fetchTodoList: asClass(FetchTodoListPrismaQuery).singleton(),
});
