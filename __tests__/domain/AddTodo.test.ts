import type { Todos } from "~/domain/Todos";
import type { TodoLists } from "~/domain/TodoLists";

import { AddTodo } from "~/domain/AddTodo";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { aTodoList } from "./builders/TodoList";
import { GenerateId } from "~/domain/GenerateId";
import { Clock } from "~/domain/Clock";
import { GenerateTestId } from "./fakes/GenerateTestId";
import { FixedClock } from "./fakes/FixedClock";

describe("AddTodo", () => {
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
    addTodo = new AddTodo({ todos, todoLists, generateId, clock });
  });

  it("should add a new todo to an existing todo list", async () => {
    // Arrange
    const theTitle = "Buy cereals";
    const theTodoListId = "todoList/1";
    const theTodoList = aTodoList().identifiedBy(theTodoListId).build();
    await todoLists.save(theTodoList);
    expect(await todos.ofTodoList(theTodoListId)).toHaveLength(0);

    // Act
    await addTodo.execute(theTodoListId, theTitle);

    // Assert
    const [todo] = await todos.ofTodoList(theTodoListId);
    expect(todo).toEqual({
      id: "todo/1",
      createdAt: "2022-01-05T12:00:00.000Z",
      isComplete: false,
      title: "Buy cereals",
      todoListId: "todoList/1",
    });
  });

  it("should not add a new todo to a todo list that does not exist", async () => {
    // Arrange
    expect.assertions(3);
    const theTodoListId = "todoList/1";
    expect(await todos.ofTodoList(theTodoListId)).toHaveLength(0);

    // Act
    try {
      await addTodo.execute(theTodoListId, "Buy cereals");
    } catch (e) {
      // Assert
      expect(e).toEqual(new Error("Todolist todoList/1 not found"));
      expect(await todos.ofTodoList(theTodoListId)).toHaveLength(0);
    }
  });
});
