import { ArchiveTodo } from "~/domain/ArchiveTodo";
import { Todos } from "~/domain/Todos";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { aTodoList } from "./builders/TodoList";
import { addTodo } from "~/domain/TodoList";
import { GenerateId } from "~/domain/GenerateId";
import { Clock } from "~/domain/Clock";
import { GenerateTestId } from "./fakes/GenerateTestId";
import { FixedClock } from "./fakes/FixedClock";

describe("Archiving a todo", () => {
  let archiveTodo: ArchiveTodo;
  let todos: Todos;
  let generateId: GenerateId;
  let clock: Clock;

  beforeEach(() => {
    todos = new TodosInMemory();
    generateId = new GenerateTestId("todo");
    clock = new FixedClock();
    archiveTodo = new ArchiveTodo({ todos });
  });

  it("should remove the todo from the todo list", async () => {
    // Arrange
    const theTodoList = aTodoList().build();
    const theTodo = addTodo(theTodoList, "Buy bread", generateId, clock);
    await todos.save(theTodo);
    expect(await todos.ofTodoList(theTodoList.id)).toHaveLength(1);

    // Act
    await archiveTodo.execute(theTodo.id);

    // Assert
    expect(await todos.ofTodoList(theTodoList.id)).toHaveLength(0);
  });
});
