import type { TodoLists } from "../../domain/TodoLists";
import type { Todos } from "../../domain/Todos";

import { PrismaClient } from "@prisma/client";
import {
  TodoListDatabaseRepository,
  TodoDatabaseRepository,
  TodoListNotFoundError,
} from "todo-list-manager";

import { aTodoList } from "../domain/builders/TodoList";
import { aTodo } from "../domain/builders/Todo";
import {
  configureTestingDatabaseEnvironment,
  prepareDatabase,
} from "./database";

describe("TodoListDatabaseRepository", () => {
  let prisma: PrismaClient;
  let todoLists: TodoLists;
  let todos: Todos;

  beforeAll(() => configureTestingDatabaseEnvironment());

  beforeEach(async () => {
    await prepareDatabase();

    prisma = new PrismaClient();
    todoLists = new TodoListDatabaseRepository(prisma);
    todos = new TodoDatabaseRepository(prisma);
  });

  afterEach(() => prisma.$disconnect());

  it("should be able to save todo lists", async () => {
    // Arrange
    const theTodoListId = "85b02c5f-312a-46bb-8770-09b9b98abde3";
    const todoList = aTodoList()
      .withId(theTodoListId)
      .withTodosOrder("todos/2", "todo/1")
      .build();

    // Act
    await todoLists.save(todoList);

    // Arrange
    expect(await todoLists.ofId(theTodoListId)).toEqual(todoList);
  });

  it("should be able to remove todo lists and their associated todos", async () => {
    // Arrange
    const theTodoListToRemoveId = "78d492f1-f182-41b9-81a4-b117ceadcca7";
    const theTodoToRemoveId = "66f7f65f-412e-44a8-babd-d9a464a2f3a8";
    const theTodoListToKeepId = "703f7440-2102-4c61-9e60-d1de142d711f";
    const theTodoToKeepId = "200d9acd-ab88-4d02-91d9-83b68a773ac4";
    await saveATodoListWithATodo(
      todoLists,
      todos,
      theTodoListToRemoveId,
      theTodoToRemoveId
    );
    await saveATodoListWithATodo(
      todoLists,
      todos,
      theTodoListToKeepId,
      theTodoToKeepId
    );

    // Act
    await todoLists.remove(theTodoListToRemoveId);

    // Assert
    await expect(todoLists.ofId(theTodoListToRemoveId)).rejects.toThrow(
      new TodoListNotFoundError("78d492f1-f182-41b9-81a4-b117ceadcca7")
    );
    expect(await todos.ofTodoList(theTodoListToRemoveId)).toHaveLength(0);
    expect(await todos.ofTodoList(theTodoListToKeepId)).toHaveLength(1);
  });

  it("should throw an error when trying to access a non-existing todo list", () => {
    const theTodoListToRemoveId = "141c8f3e-b68e-45a0-9f0e-01e77009d801";

    return expect(() => todoLists.ofId(theTodoListToRemoveId)).rejects.toThrow(
      new TodoListNotFoundError("141c8f3e-b68e-45a0-9f0e-01e77009d801")
    );
  });
});

async function saveATodoListWithATodo(
  todoLists: TodoLists,
  todos: Todos,
  todoListId: string,
  todoId: string
) {
  const todoList = aTodoList().withId(todoListId).build();
  const todo = aTodo().withId(todoId).ofTodoList(todoList.id).build();
  await todoLists.save(todoList);
  await todos.save(todo);
}
