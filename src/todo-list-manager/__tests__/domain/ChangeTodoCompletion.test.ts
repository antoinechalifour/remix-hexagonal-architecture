import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";

import { ChangeTodoCompletion } from "../../usecase/ChangeTodoCompletion";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { anUncompletedTodo } from "./builders/Todo";
import { aTodoList } from "./builders/TodoList";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { aTodoListPermission } from "./builders/TodoListPermission";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";

describe("Changing a todo completion status", () => {
  let changeTodoCompletion: ChangeTodoCompletion;
  let todoLists: TodoLists;
  let todoListPermissions: TodoListPermissions;
  let todos: Todos;

  beforeEach(() => {
    todos = new TodosInMemory();
    todoLists = new TodoListsInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    changeTodoCompletion = new ChangeTodoCompletion(
      todoLists,
      todoListPermissions,
      todos
    );
  });

  it("only the owner can change todo completion", async () => {
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
    const result = changeTodoCompletion.execute(
      theTodoListId,
      theTodoId,
      "on",
      theCollaboratorId
    );

    // Assert
    await expect(result).rejects.toEqual(
      new TodoListPermissionDenied(theTodoListId, theCollaboratorId)
    );
  });

  it("should complete the todo and move it to the end of the list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .withTodosOrder("todo/1", "todo/2", "todo/3")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    const theTodo = anUncompletedTodo()
      .withId(theTodoId)
      .ofTodoList(theTodoListId)
      .build();
    await Promise.all([
      todoListPermissions.save(thePermissions),
      todos.save(theTodo),
      todoLists.save(theTodoList),
    ]);

    // Act
    await changeTodoCompletion.execute(
      theTodoListId,
      theTodoId,
      "on",
      theOwnerId
    );

    // Assert
    expect((await todos.ofId(theTodoId)).isComplete).toBe(true);
    expect((await todoLists.ofId(theTodoListId)).todosOrder).toEqual([
      "todo/2",
      "todo/3",
      "todo/1",
    ]);
  });

  it("should uncomplete the todo and move it to the beggining of the list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .withTodosOrder("todo/3", "todo/2", "todo/1")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    const theTodo = anUncompletedTodo()
      .withId(theTodoId)
      .ofTodoList(theTodoListId)
      .build();
    await Promise.all([
      todoListPermissions.save(thePermissions),
      todoLists.save(theTodoList),
      todos.save(theTodo),
    ]);

    // Act
    await changeTodoCompletion.execute(
      theTodoListId,
      theTodoId,
      "off",
      theOwnerId
    );

    // Assert
    expect((await todos.ofId(theTodoId)).isComplete).toBe(false);
    expect((await todoLists.ofId(theTodoListId)).todosOrder).toEqual([
      "todo/1",
      "todo/3",
      "todo/2",
    ]);
  });
});
