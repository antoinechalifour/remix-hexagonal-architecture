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
    const theTodoListId = "85b02c5f-312a-46bb-8770-09b9b98abde3";
    const theOwnerId = "03dbad14-8a50-43e3-90d6-ecd4ae0e0d64";
    const todoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todos/2", "todo/1")
      .build();

    // Act
    await todoLists.save(todoList);

    // Arrange
    expect(await todoLists.ofId(theTodoListId, theOwnerId)).toEqual(todoList);
  });

  it("should be able to remove todo lists and their associated todos", async () => {
    // Arrange
    const theOwnerId = "0410dc49-24d5-4d84-a928-3f1d075f7bb1";
    const theTodoListToRemoveId = "78d492f1-f182-41b9-81a4-b117ceadcca7";
    const theTodoToRemoveId = "66f7f65f-412e-44a8-babd-d9a464a2f3a8";
    const theTodoListToKeepId = "703f7440-2102-4c61-9e60-d1de142d711f";
    const theTodoToKeepId = "200d9acd-ab88-4d02-91d9-83b68a773ac4";
    await saveATodoListWithATodo(
      todoLists,
      todos,
      theTodoListToRemoveId,
      theTodoToRemoveId,
      theOwnerId
    );
    await saveATodoListWithATodo(
      todoLists,
      todos,
      theTodoListToKeepId,
      theTodoToKeepId,
      theOwnerId
    );

    // Act
    await todoLists.remove(theTodoListToRemoveId, theOwnerId);

    // Assert
    await expect(() =>
      todoLists.ofId(theTodoListToRemoveId, theOwnerId)
    ).rejects.toThrow(
      "Todolist 78d492f1-f182-41b9-81a4-b117ceadcca7 was not found"
    );
    expect(
      await todos.ofTodoList(theTodoListToRemoveId, theOwnerId)
    ).toHaveLength(0);
    expect(
      await todos.ofTodoList(theTodoListToKeepId, theOwnerId)
    ).toHaveLength(1);
  });

  it("should throw an error when trying to access a non-existing todo list", () => {
    const theOwnerId = "637e34ce-2680-41d3-b283-d390063536df";
    const theTodoListToRemoveId = "141c8f3e-b68e-45a0-9f0e-01e77009d801";

    return expect(() =>
      todoLists.ofId(theTodoListToRemoveId, theOwnerId)
    ).rejects.toThrow(
      "Todolist 141c8f3e-b68e-45a0-9f0e-01e77009d801 was not found"
    );
  });
});

async function saveATodoListWithATodo(
  todoLists: TodoLists,
  todos: Todos,
  todoListId: string,
  todoId: string,
  ownerId: string
) {
  const todoList = aTodoList().withId(todoListId).ownedBy(ownerId).build();
  const todo = aTodo()
    .withId(todoId)
    .ofTodoList(todoList.id)
    .ownedBy(ownerId)
    .build();
  await todoLists.save(todoList);
  await todos.save(todo);
}
