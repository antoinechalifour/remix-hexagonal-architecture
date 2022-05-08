import { ArchiveTodoList } from "../../usecase/ArchiveTodoList";
import { TodoLists } from "../../domain/TodoLists";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { aTodoList } from "./builders/TodoList";

describe("Archiving a todo list", () => {
  let archiveTodoList: ArchiveTodoList;
  let todoLists: TodoLists;

  beforeEach(() => {
    todoLists = new TodoListsInMemory();
    archiveTodoList = new ArchiveTodoList(todoLists);
  });

  it("should archive the todo list", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theOwnerId = "owner/1";
    const theTodoList = aTodoList()
      .withId(theTodoListId)
      .ownedBy(theOwnerId)
      .build();
    await todoLists.save(theTodoList);
    expect(await todoLists.all(theOwnerId)).toHaveLength(1);

    // Act
    await archiveTodoList.execute(theTodoListId, theOwnerId);

    // Assert
    expect(await todoLists.all(theOwnerId)).toHaveLength(0);
  });
});
