import type { GenerateId } from "shared/id";
import type { TodoLists } from "../../domain/TodoLists";

import { Clock, FixedClock } from "shared/time";
import { AddTodoList } from "../../usecase/AddTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
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
    const theOwnerId = "owner/1";
    expect(await todoLists.all(theOwnerId)).toHaveLength(0);

    // Act
    await addTodoList.execute(theTitle, theOwnerId);

    // Assert
    const [todoList] = await todoLists.all(theOwnerId);
    expect(todoList).toEqual({
      id: "todoList/1",
      createdAt: "2022-01-05T12:00:00.000Z",
      title: "Things to do @ home",
      ownerId: "owner/1",
      todosOrder: [],
    });
  });
});
