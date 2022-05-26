import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { ReorderTodos } from "../../usecase/ReorderTodos";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList } from "./builders/TodoList";
import { aTodoListPermission } from "./builders/TodoListPermission";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";

describe("ReorderTodos", () => {
  let reorderTodos: ReorderTodos;
  let todoLists: TodoLists;
  let todoListPermissions: TodoListPermissions;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    reorderTodos = new ReorderTodos(todoLists, todoListPermissions);
  });

  it("only the owner can reorder todos", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theCollaboratorId = "collaborator/1";
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await todoListPermissions.save(thePermissions);

    // Act
    const result = reorderTodos.execute(
      theTodoListId,
      theCollaboratorId,
      "todo/2",
      3
    );

    // Assert
    await expect(result).rejects.toEqual(
      new TodoListPermissionDenied(theTodoListId, theCollaboratorId)
    );
  });

  it("places the todo at the given index", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/1", "todo/2", "todo/3", "todo/4")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoLists.save(theTodoList),
      todoListPermissions.save(thePermissions),
    ]);

    // Act
    await reorderTodos.execute(theTodoListId, theOwnerId, "todo/2", 3);

    // Assert
    const reorderedTodoList = await todoLists.ofId(theTodoListId);
    expect(reorderedTodoList.todosOrder).toEqual([
      "todo/1",
      "todo/3",
      "todo/4",
      "todo/2",
    ]);
  });

  it("throws when the index is out of bounds (negative)", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/1", "todo/2")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoLists.save(theTodoList),
      todoListPermissions.save(thePermissions),
    ]);

    // Act Assert
    return expect(() =>
      reorderTodos.execute(theTodoListId, theOwnerId, "todo/1", -1)
    ).rejects.toThrow("Index -1 is out of bounds");
  });

  it("throws when the index is out of bounds (after)", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/1", "todo/2")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoLists.save(theTodoList),
      todoListPermissions.save(thePermissions),
    ]);

    // Act Assert
    return expect(() =>
      reorderTodos.execute(theTodoListId, theOwnerId, "todo/1", 2)
    ).rejects.toThrow("Index 2 is out of bounds");
  });

  it("throws when the todo doesn't belong the todo list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/1", "todo/2")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoLists.save(theTodoList),
      todoListPermissions.save(thePermissions),
    ]);

    // Act Assert
    return expect(() =>
      reorderTodos.execute(theTodoListId, theOwnerId, "todo/999", 1)
    ).rejects.toThrow("Todo todo/999 not found");
  });
});
