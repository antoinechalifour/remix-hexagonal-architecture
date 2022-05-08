import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";

import { ChangeTodoCompletion } from "../../usecase/ChangeTodoCompletion";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { anUncompletedTodo } from "./builders/Todo";
import { aTodoList } from "./builders/TodoList";

describe("Changing a todo completion status", () => {
  let changeTodoCompletion: ChangeTodoCompletion;
  let todoLists: TodoLists;
  let todos: Todos;

  beforeEach(() => {
    todos = new TodosInMemory();
    todoLists = new TodoListsInMemory();
    changeTodoCompletion = new ChangeTodoCompletion(todoLists, todos);
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
    const theTodo = anUncompletedTodo()
      .withId(theTodoId)
      .ofTodoList(theTodoListId)
      .ownedBy(theOwnerId)
      .build();
    await Promise.all([todos.save(theTodo), todoLists.save(theTodoList)]);

    // Act
    await changeTodoCompletion.execute(
      theTodoListId,
      theTodoId,
      "on",
      theOwnerId
    );

    // Assert
    expect((await todos.ofId(theTodoId, theOwnerId)).isComplete).toBe(true);
    expect(
      (await todoLists.ofId(theTodoListId, theOwnerId)).todosOrder
    ).toEqual(["todo/2", "todo/3", "todo/1"]);
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
    const theTodo = anUncompletedTodo()
      .withId(theTodoId)
      .ofTodoList(theTodoListId)
      .ownedBy(theOwnerId)
      .build();
    await Promise.all([todoLists.save(theTodoList), todos.save(theTodo)]);

    // Act
    await changeTodoCompletion.execute(
      theTodoListId,
      theTodoId,
      "off",
      theOwnerId
    );

    // Assert
    expect((await todos.ofId(theTodoId, theOwnerId)).isComplete).toBe(false);
    expect(
      (await todoLists.ofId(theTodoListId, theOwnerId)).todosOrder
    ).toEqual(["todo/1", "todo/3", "todo/2"]);
  });
});
