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
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodo = anUncompletedTodo()
      .withId(theTodoId)
      .ownedBy(theOwnerId)
      .build();
    await todos.save(theTodo);

    // Act
    // Assert
    await changeTodoCompletion.execute(theTodo.id, "on", theOwnerId);
    expect((await todos.ofId(theTodo.id, theOwnerId)).isComplete).toBe(true);

    await changeTodoCompletion.execute(theTodo.id, "off", theOwnerId);
    expect((await todos.ofId(theTodo.id, theOwnerId)).isComplete).toBe(false);
  });
});
