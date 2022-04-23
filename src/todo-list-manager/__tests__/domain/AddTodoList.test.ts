import type { TodoLists } from "../../domain/TodoLists";
import type { Clock } from "../../domain/Clock";
import type { GenerateId } from "../../domain/GenerateId";

import { AddTodoList } from "../../usecase/AddTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { FixedClock } from "./fakes/FixedClock";
import { GenerateTestId } from "./fakes/GenerateTestId";

describe("Adding a todo list", () => {
  let addTodoList: AddTodoList;
  let todoLists: TodoLists;
  let generateId: GenerateId;
  let clock: Clock;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    generateId = new GenerateTestId("todoList");
    clock = new FixedClock();
    addTodoList = new AddTodoList(todoLists, generateId, clock);
  });

  it("should add a new todo list", async () => {
    // Arrange
    const theTitle = "Things to do @ home";
    expect(await todoLists.all()).toHaveLength(0);

    // Act
    await addTodoList.execute(theTitle);

    // Assert
    const [todoList] = await todoLists.all();
    expect(todoList).toEqual({
      id: "todoList/1",
      createdAt: "2022-01-05T12:00:00.000Z",
      title: theTitle,
    });
  });
});
