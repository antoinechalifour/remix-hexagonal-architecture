import { RenameTodo } from "todo-list-manager";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { aTodo } from "./builders/Todo";

describe("Renaming a todo", () => {
  let todos: TodosInMemory;
  let renameTodo: RenameTodo;

  beforeEach(() => {
    todos = new TodosInMemory();
    renameTodo = new RenameTodo(todos);
  });

  it("renames the todo list", async () => {
    // Arrange
    const theTodo = aTodo()
      .withId("todo/1")
      .ownedBy("owner/1")
      .withTitle("Current title")
      .build();
    await todos.save(theTodo);

    // Act
    await renameTodo.execute("todo/1", "Updated title", "owner/1");

    // Assert
    expect((await todos.ofId("todo/1")).title).toEqual("Updated title");
  });
});
