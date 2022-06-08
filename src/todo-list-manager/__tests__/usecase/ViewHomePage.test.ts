import { ViewHomePage } from "../../usecase/ViewHomePage";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";
import { TodoListQueryInMemory } from "./fakes/TodoListQueryInMemory";

let todoListPermissions: TodoListPermissionsInMemory;
let todoListQuery: TodoListQueryInMemory;
let viewHomePage: ViewHomePage;

beforeEach(() => {
  todoListPermissions = new TodoListPermissionsInMemory();
  todoListQuery = new TodoListQueryInMemory();
  viewHomePage = new ViewHomePage(todoListPermissions, todoListQuery);
});

it("shows only todolists viewable by the contributor", async () => {
  // Act
  await Promise.all([
    givenPermission(
      aTodoListPermission().forTodoList("todoList/1").forOwner("contributor/1")
    ),
    givenPermission(
      aTodoListPermission()
        .forTodoList("todoList/2")
        .withContributors("contributor/1")
    ),
  ]);
  todoListQuery.withTodoListSummary(
    {
      id: "todoList/1",
      title: "Things to buy",
      createdAt: "2022-05-30T14:00:00+00:00",
      numberOfTodos: 1,
    },
    {
      id: "todoList/2",
      title: "Things to fix",
      createdAt: "2022-06-01T14:00:00+00:00",
      numberOfTodos: 2,
    }
  );
  // Act
  const todoListsSummary = await viewHomePage.execute("contributor/1");

  // Assert
  expect(todoListsSummary).toEqual({
    totalNumberOfDoingTodos: 3,
    todoListsOwned: [
      {
        createdAt: "2022-05-30T14:00:00+00:00",
        id: "todoList/1",
        numberOfTodos: 1,
        title: "Things to buy",
        permissions: {
          archive: true,
          leave: false,
        },
      },
    ],
    todoListsContributed: [
      {
        createdAt: "2022-06-01T14:00:00+00:00",
        id: "todoList/2",
        numberOfTodos: 2,
        title: "Things to fix",
        permissions: {
          archive: false,
          leave: true,
        },
      },
    ],
  });
});

function givenPermission(permission: TodoListPermissionBuilder) {
  return todoListPermissions.save(permission.build());
}
