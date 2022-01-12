import { AddTodoList } from "~/domain/AddTodoList";
import { TodoLists } from "~/domain/TodoLists";
import { TodoListsInMemory } from "./TodoListsInMemory";

describe("AddTodoList", () => {
  let addTodoList: AddTodoList;
  let todoLists: TodoLists;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    addTodoList = new AddTodoList({ todoLists });
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
      id: expect.any(String),
      createdAt: expect.any(String),
      title: theTitle,
    });
  });
});
