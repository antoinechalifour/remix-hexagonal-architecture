import type { GenerateId } from "shared/id";
import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";

import { GenerateTestId } from "shared/id";
import { Clock, FixedClock } from "shared/time";
import { AddTodoList } from "../../usecase/AddTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";

describe("Adding a todo list", () => {
  let addTodoList: AddTodoList;
  let todoLists: TodoLists;
  let todoListPermissions: TodoListPermissions;
  let generateId: GenerateId;
  let clock: Clock;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    generateId = new GenerateTestId("todoList");
    clock = new FixedClock();
    addTodoList = new AddTodoList(
      todoLists,
      todoListPermissions,
      generateId,
      clock
    );
  });

  it("should add a new todo list", async () => {
    // Arrange
    const theTitle = "Things to do @ home";
    const theOwnerId = "owner/1";

    // Act
    await addTodoList.execute(theTitle, theOwnerId);

    // Assert
    const todoList = await todoLists.ofId("todoList/1");
    expect(todoList).toEqual({
      id: "todoList/1",
      createdAt: "2022-01-05T12:00:00.000Z",
      title: "Things to do @ home",
      todosOrder: [],
    });

    const permissions = await todoListPermissions.ofTodoList("todoList/1");
    expect(permissions).toEqual({
      todoListId: "todoList/1",
      ownerId: "owner/1",
    });
  });
});
