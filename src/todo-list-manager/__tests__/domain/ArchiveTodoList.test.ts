import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import type { TodoLists } from "../../domain/TodoLists";
import { ArchiveTodoList } from "../../usecase/ArchiveTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList } from "./builders/TodoList";
import { aTodoListPermission } from "./builders/TodoListPermission";

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
    await expect(result).rejects.toEqual(new Error("Do not have permission"));
  });

  it("should archive the todo list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoLists.save(theTodoList),
      todoListPermissions.save(thePermissions),
    ]);
    expect(await todoLists.all(theOwnerId)).toHaveLength(1);

    // Act
    await archiveTodoList.execute(theTodoListId, theOwnerId);

    // Assert
    expect(await todoLists.all(theOwnerId)).toHaveLength(0);
  });
});
