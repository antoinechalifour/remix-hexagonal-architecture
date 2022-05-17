import { Todos } from "../../domain/Todos";
import { UntagTodo } from "../../usecase/UntagTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { aTodo } from "./builders/Todo";

describe("Untagging a todo", () => {
  let todos: Todos;
  let untagTodo: UntagTodo;

  beforeEach(() => {
    todos = new TodosInMemory();
    untagTodo = new UntagTodo(todos);
  });

  it("remove the given tag from the tags", async () => {
    // Arrange
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodo = aTodo()
      .withId(theTodoId)
      .ownedBy(theOwnerId)
      .taggedAs("feature", "top priority", "research required")
      .build();
    await todos.save(theTodo);

    // Act
    await untagTodo.execute(theTodoId, theOwnerId, "top priority");

    // Assert
    expect((await todos.ofId(theTodoId, theOwnerId)).tags).toEqual([
      "feature",
      "research required",
    ]);
  });
});
