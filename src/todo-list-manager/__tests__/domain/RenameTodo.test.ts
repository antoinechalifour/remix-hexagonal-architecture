import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import type { Todos } from "../../domain/Todos";
import { RenameTodo } from "../../usecase/RenameTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo } from "./builders/Todo";
import { aTodoListPermission } from "./builders/TodoListPermission";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";

describe("Renaming a todo", () => {
  let todos: Todos;
  let todoListPermissions: TodoListPermissions;
  let renameTodo: RenameTodo;

  beforeEach(() => {
    todos = new TodosInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    renameTodo = new RenameTodo(todos, todoListPermissions);
  });

  it("only the owner can rename a todo list", async () => {
    // Arrange
    let theTodoListId = "todoList/1";
    let theOwnerId = "owner/1";
    let theCollaboratorId = "collaborator/1";
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await todoListPermissions.save(thePermissions);

    // Act
    const result = renameTodo.execute(
      theTodoListId,
      "todo/1",
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
    const theOwnerId = "owner/1";
    const theTodoListId = "todoList/1";
    const theTodoId = "todo/1";
    const theTodo = aTodo()
      .withId(theTodoId)
      .withTitle("Current title")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoListPermissions.save(thePermissions),
      todos.save(theTodo),
    ]);

    // Act
    await renameTodo.execute(
      theTodoListId,
      theTodoId,
      "Updated title",
      theOwnerId
    );

    // Assert
    expect((await todos.ofId("todo/1")).title).toEqual("Updated title");
  });
});
