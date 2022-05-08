import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import { GenerateId } from "shared";

import { AddTodo } from "../../usecase/AddTodo";
import { Clock } from "../../domain/Clock";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { GenerateTestId } from "./fakes/GenerateTestId";
import { FixedClock } from "./fakes/FixedClock";
import { aTodoList } from "./builders/TodoList";

describe("Adding a todo", () => {
  let addTodo: AddTodo;
  let todos: Todos;
  let todoLists: TodoLists;
  let generateId: GenerateId;
  let clock: Clock;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    todos = new TodosInMemory();
    generateId = new GenerateTestId("todo");
    clock = new FixedClock();
    addTodo = new AddTodo(todos, todoLists, generateId, clock);
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
    await todoLists.save(theTodoList);
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
    });

    const updatedTodoList = await todoLists.ofId(theTodoListId, theOwnerId);
    expect(updatedTodoList.todosOrder).toEqual(["todo/0", "todo/1"]);
  });

  it("should not add a new todo to a todo list that does not exist", async () => {
    // Arrange
    expect.assertions(3);
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    expect(await todos.ofTodoList(theTodoListId, theOwnerId)).toHaveLength(0);

    await expect(() =>
      addTodo.execute(theTodoListId, "Buy cereals", theOwnerId)
    ).rejects.toEqual(new Error("Todolist todoList/1 not found"));

    expect(await todos.ofTodoList(theTodoListId, theOwnerId)).toHaveLength(0);
  });
});
