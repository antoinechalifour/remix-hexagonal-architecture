import type { Todos } from "../../domain/Todos";

import { ChangeTodoCompletion } from "../../usecase/ChangeTodoCompletion";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { anUncompletedTodo } from "./builders/Todo";

describe("Changing a todo completion status", () => {
  let changeTodoCompletion: ChangeTodoCompletion;
  let todos: Todos;

  beforeEach(() => {
    todos = new TodosInMemory();
    changeTodoCompletion = new ChangeTodoCompletion(todos);
  });

  it("should allow a todo to be completed or uncompleted", async () => {
    // Arrange
    let theTodoId = "todo/1";
    const theTodo = anUncompletedTodo().identifiedBy(theTodoId).build();
    await todos.save(theTodo);

    // Act
    // Assert
    await changeTodoCompletion.execute(theTodo.id, "on");
    expect((await todos.ofId(theTodo.id)).isComplete).toBe(true);

    await changeTodoCompletion.execute(theTodo.id, "off");
    expect((await todos.ofId(theTodo.id)).isComplete).toBe(false);
  });
});
