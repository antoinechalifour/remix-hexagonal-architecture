import type { GenerateId } from "shared/id";
import { GenerateTestId } from "shared/id";
import type { TodoLists } from "../../domain/TodoLists";

import { Clock, FixedClock } from "shared/time";
import { AddTodoList } from "../../usecase/AddTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { TodoListPermission } from "../../domain/TodoListPermission";
import { TodoListId } from "../../domain/TodoList";

class TodoListPermissionsInMemory implements TodoListPermissions {
  private __database = new Map<TodoListId, TodoListPermission>();

  async ofTodoList(todoListId: TodoListId): Promise<TodoListPermission> {
    const todoListPermission = this.__database.get(todoListId);
    if (!todoListPermission) throw new Error("That's really bad!");

    return todoListPermission;
  }

  async save(todoListPermission: TodoListPermission): Promise<void> {
    this.__database.set(todoListPermission.todoListId, todoListPermission);
  }
}

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
    expect(await todoLists.all(theOwnerId)).toHaveLength(0);

    // Act
    await addTodoList.execute(theTitle, theOwnerId);

    // Assert
    const [todoList] = await todoLists.all(theOwnerId);
    expect(todoList).toEqual({
      id: "todoList/1",
      createdAt: "2022-01-05T12:00:00.000Z",
      title: "Things to do @ home",
      ownerId: "owner/1",
      todosOrder: [],
    });

    const permissions = await todoListPermissions.ofTodoList("todoList/1");
    expect(permissions).toEqual({
      todoListId: "todoList/1",
      ownerId: "owner/1",
    });
  });
});
