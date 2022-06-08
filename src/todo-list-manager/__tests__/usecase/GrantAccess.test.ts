import { GrantAccess } from "../../usecase/GrantAccess";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { ContributorsInMemory } from "./fakes/ContributorsInMemory";

let grantAccess: GrantAccess;
let todoListPermissions: TodoListPermissionsInMemory;
let contributors: ContributorsInMemory;

beforeEach(() => {
  todoListPermissions = new TodoListPermissionsInMemory();
  contributors = new ContributorsInMemory();
  grantAccess = new GrantAccess(todoListPermissions, contributors);
});

it("sharing todo list requires permissions", async () => {
  await givenPermission(
    aTodoListPermission()
      .forTodoList("todoList/1")
      .forOwner("contributor/owner")
  );

  await expect(
    grantAccess.execute(
      "todoList/1",
      "contributor/not-authorized",
      "john.doe@example.com"
    )
  ).rejects.toEqual(
    new TodoListPermissionDeniedError(
      "todoList/1",
      "contributor/not-authorized"
    )
  );
});

const AUTHORIZED_CASES = [
  {
    role: "authorized contributor",
    todoListId: "todoList/1",
    contributorId: "contributor/authorized",
    permission: aTodoListPermission()
      .forTodoList("todoList/1")
      .withContributors("contributor/authorized"),
  },
  {
    role: "owner",
    todoListId: "todoList/2",
    contributorId: "contributor/owner",
    permission: aTodoListPermission()
      .forTodoList("todoList/2")
      .forOwner("contributor/owner"),
  },
];

AUTHORIZED_CASES.forEach(({ role, todoListId, contributorId, permission }) =>
  it(`authorizes new contributors (role=${role})`, async () => {
    // Arrange
    contributors.addTestContributor({
      id: "contributor/new",
      email: "john.doe@example.com",
    });
    await givenPermission(permission);

    await grantAccess.execute(
      todoListId,
      contributorId,
      "john.doe@example.com"
    );
    await grantAccess.execute(
      // Execute twice to check for duplicates
      todoListId,
      contributorId,
      "john.doe@example.com"
    );

    expect(await todoListPermissions.ofTodoList(todoListId)).toEqual(
      permission.withNewContributors("contributor/new").build()
    );
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}
