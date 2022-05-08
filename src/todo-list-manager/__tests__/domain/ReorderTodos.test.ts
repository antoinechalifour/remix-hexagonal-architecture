import { ReorderTodos } from "../../usecase/ReorderTodos";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { aTodoList } from "./builders/TodoList";

describe("ReorderTodos", () => {
  let reorderTodos: ReorderTodos;
  let todoLists: TodoListsInMemory;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    reorderTodos = new ReorderTodos(todoLists);
  });

  it("places the todo at the given index", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/1", "todo/2", "todo/3", "todo/4")
      .build();
    await todoLists.save(theTodoList);

    // Act
    await reorderTodos.execute(theTodoListId, theOwnerId, "todo/2", 3);

    // Assert
    const reorderedTodoList = await todoLists.ofId(theTodoListId);
    expect(reorderedTodoList.todosOrder).toEqual([
      "todo/1",
      "todo/3",
      "todo/4",
      "todo/2",
    ]);
  });

  it("throws when the index is out of bounds (negative)", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/1", "todo/2")
      .build();
    await todoLists.save(theTodoList);

    // Act Assert
    return expect(() =>
      reorderTodos.execute(theTodoListId, theOwnerId, "todo/1", -1)
    ).rejects.toThrow("Index -1 is out of bounds");
  });

  it("throws when the index is out of bounds (after)", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/1", "todo/2")
      .build();
    await todoLists.save(theTodoList);

    // Act Assert
    return expect(() =>
      reorderTodos.execute(theTodoListId, theOwnerId, "todo/1", 2)
    ).rejects.toThrow("Index 2 is out of bounds");
  });

  it("throws when the todo doesn't belong the todo list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todo/1", "todo/2")
      .build();
    await todoLists.save(theTodoList);

    // Act Assert
    return expect(() =>
      reorderTodos.execute(theTodoListId, theOwnerId, "todo/999", 1)
    ).rejects.toThrow("Todo todo/999 not found");
  });
});
