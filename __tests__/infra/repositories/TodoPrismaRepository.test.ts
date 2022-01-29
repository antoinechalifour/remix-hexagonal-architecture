import type { Todos } from "~/domain/Todos";

import { PrismaClient } from "@prisma/client";
import { TodoPrismaRepository } from "~/infrastructure/repositories/TodoPrismaRepository";
import {
  configureTestingDatabaseEnvironment,
  prepareDatabase,
} from "./database";
import { anUncompletedTodo } from "../../domain/builders/Todo";
import { updateCompletion } from "~/domain/Todo";
import { aTodoList } from "../../domain/builders/TodoList";
import { TodoLists } from "~/domain/TodoLists";
import { TodoListPrismaRepository } from "~/infrastructure/repositories/TodoListPrismaRepository";

describe("TodoPrismaRepository", () => {
  let todos: Todos;
  let todoLists: TodoLists;
  let prisma: PrismaClient;

  beforeAll(() => configureTestingDatabaseEnvironment());

  beforeEach(async () => {
    await prepareDatabase();

    prisma = new PrismaClient();
    todos = new TodoPrismaRepository({ prisma });
    todoLists = new TodoListPrismaRepository({ prisma });
  });

  afterEach(() => prisma.$disconnect());

  it("persists and retrieves todos", async () => {
    const todoList = aTodoList().build();
    await todoLists.save(todoList);

    // Persist todos
    let todo = anUncompletedTodo()
      .identifiedBy("todos/1")
      .ofTodoList(todoList.id)
      .build();
    await todos.save(todo);
    expect(await todos.ofId("todos/1")).toEqual(todo);

    // Updates todos
    todo = updateCompletion(todo, true);
    await todos.save(todo);
    expect(await todos.ofId("todos/1")).toEqual(todo);

    // Removes todos
    await todos.remove("todos/1");
    await expect(() => todos.ofId("todos/1")).rejects.toThrow(
      new Error("No Todo found")
    );
  });
});
