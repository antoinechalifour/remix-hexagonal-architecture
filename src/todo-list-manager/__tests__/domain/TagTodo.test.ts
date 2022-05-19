import { Todos } from "../../domain/Todos";
import { TagTodo } from "../../usecase/TagTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { aTodo } from "./builders/Todo";

describe("Tagging a todo", () => {
  let todos: Todos;
  let tagTodo: TagTodo;

  beforeEach(() => {
    todos = new TodosInMemory();
    tagTodo = new TagTodo(todos);
  });

  it("adds new tags to the todo", async () => {
    // Arrange
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodo = aTodo().withId(theTodoId).ownedBy(theOwnerId).build();
    await todos.save(theTodo);

    // Act
    await tagTodo.execute(theTodoId, theOwnerId, "feature");
    await tagTodo.execute(theTodoId, theOwnerId, "top priority");
    await tagTodo.execute(theTodoId, theOwnerId, "feature");

    // Assert
    expect((await todos.ofId(theTodoId, theOwnerId)).tags).toEqual([
      "feature",
      "top priority",
    ]);
  });

  it("is limited to 3 tags", async () => {
    // Arrange
    const theTodoId = "todo/1";
    const theOwnerId = "owner/1";
    const theTodo = aTodo()
      .withId(theTodoId)
      .ownedBy(theOwnerId)
      .taggedAs("tag 1", "tag 2", "tag 3")
      .build();
    await todos.save(theTodo);

    // Act
    const result = tagTodo.execute(theTodoId, theOwnerId, "tag 4");

    // Assert
    await expect(result).rejects.toEqual(
      new Error("Todos can only have at most 3 tags")
    );
  });
});
