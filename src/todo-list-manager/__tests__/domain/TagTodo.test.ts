import { Todos } from "../../domain/Todos";
import { TagTodo } from "../../usecase/TagTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { aTodo } from "./builders/Todo";
import { aTodoListPermission } from "./builders/TodoListPermission";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { TodoListPermissions } from "../../domain/TodoListPermissions";

describe("Tagging a todo", () => {
  let todos: Todos;
  let todoListPermissions: TodoListPermissions;
  let tagTodo: TagTodo;

  beforeEach(() => {
    todos = new TodosInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    tagTodo = new TagTodo(todos, todoListPermissions);
  });

  it("only the owner can tag todos", async () => {
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
    const result = tagTodo.execute(
      theTodoListId,
      theTodoId,
      theCollaboratorId,
      "feature"
    );

    // Assert
    await expect(result).rejects.toEqual(new Error("Do not have permission"));
  });

  it("adds new tags to the todo", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodo = aTodo().withId(theTodoId).ownedBy(theOwnerId).build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todos.save(theTodo),
      todoListPermissions.save(thePermissions),
    ]);

    // Act
    await tagTodo.execute(theTodoListId, theTodoId, theOwnerId, "feature");
    await tagTodo.execute(theTodoListId, theTodoId, theOwnerId, "top priority");
    await tagTodo.execute(theTodoListId, theTodoId, theOwnerId, "feature");

    // Assert
    expect((await todos.ofId(theTodoId, theOwnerId)).tags).toEqual([
      "feature",
      "top priority",
    ]);
  });

  it("is limited to 3 tags", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodo = aTodo()
      .withId(theTodoId)
      .ownedBy(theOwnerId)
      .taggedAs("tag 1", "tag 2", "tag 3")
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
    const result = tagTodo.execute(
      theTodoListId,
      theTodoId,
      theOwnerId,
      "tag 4"
    );

    // Assert
    await expect(result).rejects.toEqual(
      new Error("Todos can only have at most 3 tags")
    );
  });
});
