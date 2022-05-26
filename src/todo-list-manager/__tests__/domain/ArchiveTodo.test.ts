import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import { ArchiveTodo } from "../../usecase/ArchiveTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { aTodoList } from "./builders/TodoList";
import { aTodo } from "./builders/Todo";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { aTodoListPermission } from "./builders/TodoListPermission";

describe("Archiving a todo", () => {
  let archiveTodo: ArchiveTodo;
  let todoLists: TodoLists;
  let todoListPermissions: TodoListPermissions;
  let todos: Todos;

  beforeEach(() => {
    todos = new TodosInMemory();
    todoLists = new TodoListsInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    archiveTodo = new ArchiveTodo(todoLists, todoListPermissions, todos);
  });

  it("only the owner can archive a todo", async () => {
    // Arrange
    const theOwnerId = "owner/1";
    const theCollaboratorId = "collaborator/unauthorized";
    const theTodoListId = "todoLists/1";
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await todoListPermissions.save(thePermissions);

    // Act
    const result = archiveTodo.execute(
      theTodoListId,
      "todos/1",
      theCollaboratorId
    );

    // Assert
    await expect(result).rejects.toEqual(new Error("Do not have permission"));
  });

  it("should remove the todo from the todo list", async () => {
    // Arrange
    const theOwnerId = "owner/1";
    const theTodoListId = "todoLists/1";

    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todos/1", "todos/2")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    const theTodoRemoved = aTodo()
      .withId("todos/1")
      .ownedBy(theOwnerId)
      .ofTodoList(theTodoListId)
      .build();
    const theTodoNotRemoved = aTodo()
      .withId("todos/2")
      .ownedBy(theOwnerId)
      .ofTodoList(theTodoListId)
      .build();

    await Promise.all([
      todoLists.save(theTodoList),
      todoListPermissions.save(thePermissions),
      todos.save(theTodoRemoved),
      todos.save(theTodoNotRemoved),
    ]);
    expect(await todos.ofTodoList(theTodoListId)).toHaveLength(2);

    // Act
    await archiveTodo.execute(theTodoListId, "todos/1", theOwnerId);

    // Assert
    expect(await todos.ofTodoList(theTodoListId)).toEqual([theTodoNotRemoved]);
    const updatedTodoList = await todoLists.ofId(theTodoListId);
    expect(updatedTodoList.todosOrder).toEqual(["todos/2"]);
  });
});
