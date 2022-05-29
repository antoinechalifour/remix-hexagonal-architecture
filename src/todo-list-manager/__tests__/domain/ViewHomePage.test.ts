import { TodoListsSummaryDto } from "shared/client";
import { ViewHomePage } from "../../usecase/ViewHomePage";
import { TodoListQuery } from "../../domain/TodoListQuery";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoListPermission } from "./builders/TodoListPermission";

describe("Viewing the home page", () => {
  let todoListPermissions: TodoListPermissionsInMemory;
  let todoListQuery: TodoListQuery;
  let viewHomePage: ViewHomePage;

  beforeEach(() => {
    todoListPermissions = new TodoListPermissionsInMemory();
    todoListQuery = {
      detailsOfTodoList: jest.fn(),
      summaryOfTodoLists: jest.fn(),
    };
    viewHomePage = new ViewHomePage(todoListPermissions, todoListQuery);
  });

  it("shows only todolists viewable by the collaborator", async () => {
    // Act
    const summary: TodoListsSummaryDto = {
      todoLists: [
        {
          id: "todoList/1",
          title: "grossiries",
          createdAt: "2022-05-30T14:00:00+00:00",
          numberOfTodos: 1,
        },
      ],
      totalNumberOfDoingTodos: 0,
    };
    (todoListQuery.summaryOfTodoLists as jest.Mock).mockResolvedValue(summary);
    const theCollaboratorId = "collaborator/1";
    const theAuthorizedTodoList = "todoList/1";
    await todoListPermissions.save(
      aTodoListPermission()
        .forOwner(theCollaboratorId)
        .forTodoList(theAuthorizedTodoList)
        .build()
    );

    // Act
    const todoListsSummary = await viewHomePage.execute(theCollaboratorId);

    // Assert
    expect(todoListQuery.summaryOfTodoLists).toHaveBeenCalledWith([
      theAuthorizedTodoList,
    ]);
    expect(todoListsSummary).toEqual(summary);
  });
});
