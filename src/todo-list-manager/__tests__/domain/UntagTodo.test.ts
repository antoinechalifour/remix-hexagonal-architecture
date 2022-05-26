import type { Todos } from "../../domain/Todos";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { UntagTodo } from "../../usecase/UntagTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo } from "./builders/Todo";
import { aTodoListPermission } from "./builders/TodoListPermission";

describe("Untagging a todo", () => {
  let todos: Todos;
  let todoListPermissions: TodoListPermissions;
  let untagTodo: UntagTodo;

  beforeEach(() => {
    todos = new TodosInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    untagTodo = new UntagTodo(todos, todoListPermissions);
  });

  it("only the owner can untag a todo", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theCollaboratorId = "collaborator/1";
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await todoListPermissions.save(thePermissions);

    // Act
    const result = untagTodo.execute(
      theTodoListId,
      theTodoId,
      theCollaboratorId,
      "top priority"
    );

    // Assert
    await expect(result).rejects.toEqual(new Error("Do not have permission"));
  });

  it("remove the given tag from the tags", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodo = aTodo()
      .withId(theTodoId)
      .ownedBy(theOwnerId)
      .taggedAs("feature", "top priority", "research required")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todos.save(theTodo),
      todoListPermissions.save(thePermissions),
    ]);

    // Act
    await untagTodo.execute(
      theTodoListId,
      theTodoId,
      theOwnerId,
      "top priority"
    );

    // Assert
    expect((await todos.ofId(theTodoId)).tags).toEqual([
      "feature",
      "research required",
    ]);
  });
});
