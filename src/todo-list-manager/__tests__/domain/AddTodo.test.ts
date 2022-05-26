import type { GenerateId } from "shared/id";
import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { Clock, FixedClock } from "shared/time";
import { GenerateTestId } from "shared/id";
import { AddTodo } from "../../usecase/AddTodo";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList } from "./builders/TodoList";
import { aTodoListPermission } from "./builders/TodoListPermission";

describe("Adding a todo", () => {
  let addTodo: AddTodo;
  let todos: Todos;
  let todoLists: TodoLists;
  let todoListPermissions: TodoListPermissions;
  let generateId: GenerateId;
  let clock: Clock;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    todoListPermissions = new TodoListPermissionsInMemory();
    todos = new TodosInMemory();
    generateId = new GenerateTestId("todo");
    clock = new FixedClock();
    addTodo = new AddTodo(
      todos,
      todoLists,
      todoListPermissions,
      generateId,
      clock
    );
  });

  it("only the owner can add a todo", async () => {
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
    const result = addTodo.execute(
      theTodoListId,
      "Some random title",
      theCollaboratorId
    );

    // Assert
    await expect(result).rejects.toEqual(new Error("Do not have permission"));
  });

  it("should add a new todo to an existing todo list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/0")
      .build();
    const thePermissions = aTodoListPermission()
      .forTodoList(theTodoListId)
      .forOwner(theOwnerId)
      .build();
    await Promise.all([
      todoLists.save(theTodoList),
      todoListPermissions.save(thePermissions),
    ]);
    expect(await todos.ofTodoList(theTodoListId, theOwnerId)).toHaveLength(0);

    // Act
    await addTodo.execute(theTodoListId, "Buy cereals", theOwnerId);

    // Assert
    const [todo] = await todos.ofTodoList(theTodoListId, theOwnerId);
    expect(todo).toEqual({
      id: "todo/1",
      createdAt: "2022-01-05T12:00:00.000Z",
      isComplete: false,
      title: "Buy cereals",
      todoListId: "todoList/1",
      ownerId: "owner/1",
      tags: [],
    });

    const updatedTodoList = await todoLists.ofId(theTodoListId, theOwnerId);
    expect(updatedTodoList.todosOrder).toEqual(["todo/0", "todo/1"]);
  });
});
