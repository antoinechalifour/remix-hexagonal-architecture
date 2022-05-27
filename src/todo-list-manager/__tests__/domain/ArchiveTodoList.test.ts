import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import type { TodoLists } from "../../domain/TodoLists";
import { ArchiveTodoList } from "../../usecase/ArchiveTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList } from "./builders/TodoList";
import { aTodoListPermission } from "./builders/TodoListPermission";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";

describe("Archiving a todo list", () => {
  let archiveTodoList: ArchiveTodoList;
  let todoLists: TodoLists;
  let todoListPermissions: TodoListPermissions;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    archiveTodoList = new ArchiveTodoList(todoLists, todoListPermissions);
  });

  it("only the owner can archive a todo list", async () => {
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
    const result = archiveTodoList.execute(theTodoListId, theCollaboratorId);

    // Assert
    await expect(result).rejects.toEqual(
      new TodoListPermissionDenied(theTodoListId, theCollaboratorId)
    );
  });

  it("should archive the todo list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList().withId(theTodoListId).build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoLists.save(theTodoList),
      todoListPermissions.save(thePermissions),
    ]);

    // Act
    await archiveTodoList.execute(theTodoListId, theOwnerId);

    // Assert
    expect(() => todoLists.ofId(theTodoListId)).toThrow(
      new Error(`Todolist todoList/1 not found`)
    );
  });
});
