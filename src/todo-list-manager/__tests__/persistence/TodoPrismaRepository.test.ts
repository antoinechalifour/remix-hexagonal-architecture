import type { Todos } from "../../domain/Todos";

import { PrismaClient } from "@prisma/client";
import {
  TodoListDatabaseRepository,
  TodoDatabaseRepository,
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
    todos = new TodoDatabaseRepository(prisma);
    todoLists = new TodoListDatabaseRepository(prisma);
  });

  afterEach(() => prisma.$disconnect());

  it("persists and retrieves todos", async () => {
    const theTodoId = "eb7531dd-0e2b-47b6-9bca-47182995f3ab";
    const todoList = aTodoList().build();
    await todoLists.save(todoList);

    // Persist todos
    let todo = anUncompletedTodo()
      .withId(theTodoId)
      .ofTodoList(todoList.id)
      .build();
    await todos.save(todo);
    expect(await todos.ofId(theTodoId)).toEqual(todo);

    // Updates todos
    todo = updateCompletion(todo, true);
    await todos.save(todo);
    expect(await todos.ofId(theTodoId)).toEqual(todo);

    // Removes todos
    await todos.remove(theTodoId);
    await expect(() => todos.ofId(theTodoId)).rejects.toThrow(
      new Error("No Todo found")
    );
  });
});
