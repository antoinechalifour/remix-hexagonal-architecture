import type { Todos } from "../../domain/Todos";

import { PrismaClient } from "@prisma/client";
import {
  TodoListPrismaRepository,
  TodoPrismaRepository,
} from "todo-list-manager";
import { updateCompletion } from "../../domain/Todo";
import { TodoLists } from "../../domain/TodoLists";
import { anUncompletedTodo } from "../domain/builders/Todo";
import { aTodoList } from "../domain/builders/TodoList";
import {
  configureTestingDatabaseEnvironment,
  prepareDatabase,
} from "./database";

describe("TodoPrismaRepository", () => {
  let todos: Todos;
  let todoLists: TodoLists;
  let prisma: PrismaClient;

  beforeAll(() => configureTestingDatabaseEnvironment());

  beforeEach(async () => {
    await prepareDatabase();

    prisma = new PrismaClient();
    todos = new TodoPrismaRepository(prisma);
    todoLists = new TodoListPrismaRepository(prisma);
  });

  afterEach(() => prisma.$disconnect());

  it("persists and retrieves todos", async () => {
    const theOwnerId = "feff99e6-875f-4cf6-9c5a-40ee20008fc2";
    const theTodoId = "eb7531dd-0e2b-47b6-9bca-47182995f3ab";
    const todoList = aTodoList().ownedBy(theOwnerId).build();
    await todoLists.save(todoList);

    // Persist todos
    let todo = anUncompletedTodo()
      .withId(theTodoId)
      .ofTodoList(todoList.id)
      .ownedBy(theOwnerId)
      .build();
    await todos.save(todo);
    expect(await todos.ofId(theTodoId, theOwnerId)).toEqual(todo);

    // Updates todos
    todo = updateCompletion(todo, true);
    await todos.save(todo);
    expect(await todos.ofId(theTodoId, theOwnerId)).toEqual(todo);

    // Removes todos
    await todos.remove(theTodoId, theOwnerId);
    await expect(() => todos.ofId(theTodoId, theOwnerId)).rejects.toThrow(
      new Error("No Todo found")
    );
  });
});
