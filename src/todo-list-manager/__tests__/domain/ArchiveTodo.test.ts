import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import { ArchiveTodo } from "../../usecase/ArchiveTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { aTodoList } from "./builders/TodoList";
import { aTodo } from "./builders/Todo";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";

describe("Archiving a todo", () => {
  let archiveTodo: ArchiveTodo;
  let todoLists: TodoLists;
  let todos: Todos;

  beforeEach(() => {
    todos = new TodosInMemory();
    todoLists = new TodoListsInMemory();
    archiveTodo = new ArchiveTodo(todoLists, todos);
  });

  it("should remove the todo from the todo list", async () => {
    // Arrange
    const theOwnerId = "owner/1";
    const theTodoListId = "todoLists/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .withTodosOrder("todos/1", "todos/2")
      .build();
    const theTodoRemoved = aTodo()
      .withId("todos/1")
      .ownedBy(theOwnerId)
      .ofTodoList(theTodoListId)
      .build();
    const theTodoNotRemoved = aTodo()
      .withId("todos/2")
      .ownedBy(theOwnerId)
      .ofTodoList(theTodoListId)
      .build();
    await todoLists.save(theTodoList);
    await todos.save(theTodoRemoved);
    await todos.save(theTodoNotRemoved);
    expect(await todos.ofTodoList(theTodoListId, theOwnerId)).toHaveLength(2);

    // Act
    await archiveTodo.execute(theTodoListId, "todos/1", theOwnerId);

    // Assert
    expect(await todos.ofTodoList(theTodoListId, theOwnerId)).toEqual([
      theTodoNotRemoved,
    ]);
    const updatedTodoList = await todoLists.ofId(theTodoListId, theOwnerId);
    expect(updatedTodoList.todosOrder).toEqual(["todos/2"]);
  });
});
