import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { RenameTodoList } from "../../usecase/RenameTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList } from "./builders/TodoList";
import { aTodoListPermission } from "./builders/TodoListPermission";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";

describe("Renaming a todo list", () => {
  let todoLists: TodoLists;
  let todoListPermissions: TodoListPermissions;
  let renameTodoList: RenameTodoList;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    renameTodoList = new RenameTodoList(todoLists, todoListPermissions);
  });

  it("only the owner can rename a todo list", async () => {
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
    const result = renameTodoList.execute(
      theTodoListId,
      "Updated title",
      theCollaboratorId
    );

    // Assert
    await expect(result).rejects.toEqual(
      new TodoListPermissionDenied(theTodoListId, theCollaboratorId)
    );
  });

  it("renames the todo list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    let theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .withTitle("Current title")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoListPermissions.save(thePermissions),
      todoLists.save(theTodoList),
    ]);

    // Act
    await renameTodoList.execute(theTodoListId, "Updated title", theOwnerId);

    // Assert
    expect((await todoLists.ofId(theTodoListId)).title).toEqual(
      "Updated title"
    );
  });
});
