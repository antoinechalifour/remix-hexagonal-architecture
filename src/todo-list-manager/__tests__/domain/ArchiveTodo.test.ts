import type { GenerateId } from "shared";
import { ArchiveTodo } from "../../usecase/ArchiveTodo";
import { Todos } from "../../domain/Todos";
import { addTodo } from "../../domain/TodoList";
import { Clock } from "../../domain/Clock";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { GenerateTestId } from "./fakes/GenerateTestId";
import { FixedClock } from "./fakes/FixedClock";
import { aTodoList } from "./builders/TodoList";

describe("Archiving a todo", () => {
  let archiveTodo: ArchiveTodo;
  let todos: Todos;
  let generateId: GenerateId;
  let clock: Clock;

  beforeEach(() => {
    todos = new TodosInMemory();
    generateId = new GenerateTestId("todo");
    clock = new FixedClock();
    archiveTodo = new ArchiveTodo(todos);
  });

  it("should remove the todo from the todo list", async () => {
    // Arrange
    const theTodoList = aTodoList().build();
    const theTodo = addTodo(theTodoList, "Buy bread", generateId, clock);
    await todos.save(theTodo);
    expect(await todos.ofTodoList(theTodoList.id, "owner/1")).toHaveLength(1);

    // Act
    await archiveTodo.execute(theTodo.id, "owner/1");

    // Assert
    expect(await todos.ofTodoList(theTodoList.id, "owner/1")).toHaveLength(0);
  });
});
