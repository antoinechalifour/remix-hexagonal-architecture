import type { TodoLists } from "../../domain/TodoLists";
import type { Todos } from "../../domain/Todos";

import { PrismaClient } from "@prisma/client";
import {
  TodoListPrismaRepository,
  TodoPrismaRepository,
} from "todo-list-manager";

import { aTodoList } from "../domain/builders/TodoList";
import { aTodo } from "../domain/builders/Todo";
import {
  configureTestingDatabaseEnvironment,
  prepareDatabase,
} from "./database";

describe("TodoListPrismaRepository", () => {
  let prisma: PrismaClient;
  let todoLists: TodoLists;
  let todos: Todos;

  beforeAll(() => configureTestingDatabaseEnvironment());

  beforeEach(async () => {
    await prepareDatabase();

    prisma = new PrismaClient();
    todoLists = new TodoListPrismaRepository(prisma);
    todos = new TodoPrismaRepository(prisma);
  });

  afterEach(() => prisma.$disconnect());

  it("should be able to save todo lists", async () => {
    // Arrange
    const todoList = aTodoList().identifiedBy("todoList/1").build();

    // Act
    await todoLists.save(todoList);

    // Arrange
    expect(await todoLists.ofId("todoList/1", "owner/1")).toEqual(todoList);
  });

  it("should be able to remove todo lists and their associated todos", async () => {
    // Arrange
    await saveATodoListWithATodo(todoLists, todos, "todoLists/1", "todos/1");
    await saveATodoListWithATodo(todoLists, todos, "todoLists/2", "todos/2");

    // Act
    await todoLists.remove("todoLists/1", "owner/1");

    // Assert
    await expect(() =>
      todoLists.ofId("todoLists/1", "owner/1")
    ).rejects.toThrow("Todolist todoLists/1 was not found");
    expect(await todos.ofTodoList("todoLists/1", "owner/1")).toHaveLength(0);
    expect(await todos.ofTodoList("todoLists/2", "owner/1")).toHaveLength(1);
  });

  it("should throw an error when trying to access a non-existing todo list", () =>
    expect(() => todoLists.ofId("todoLists/1", "owner/1")).rejects.toThrow(
      "Todolist todoLists/1 was not found"
    ));
});

async function saveATodoListWithATodo(
  todoLists: TodoLists,
  todos: Todos,
  todoListId: string,
  todoId: string
) {
  const todoList = aTodoList().identifiedBy(todoListId).build();
  const todo = aTodo().identifiedBy(todoId).ofTodoList(todoList.id).build();
  await todoLists.save(todoList);
  await todos.save(todo);
}
