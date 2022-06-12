import { CollectEvents } from "shared/events";
import { TodoListAccessGranted } from "../../domain/event/TodoListAccessGranted";
import { GrantAccess } from "../../usecase/GrantAccess";
import { TodoListPermissionDeniedError } from "../../domain/error/TodoListPermissionDeniedError";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";
import { ContributorsInMemory } from "./fakes/ContributorsInMemory";
import { FixedClock } from "shared/time";

let grantAccess: GrantAccess;
let todoListPermissions: TodoListPermissionsInMemory;
let contributors: ContributorsInMemory;
let clock: FixedClock;
let events: CollectEvents;

jest.mock("uuid", () => ({
  v4: () => "e775b0c1-7622-40df-a329-95f83b260c80",
}));

beforeEach(() => {
  todoListPermissions = new TodoListPermissionsInMemory();
  contributors = new ContributorsInMemory();
  events = new CollectEvents();
  clock = new FixedClock();
  grantAccess = new GrantAccess(
    todoListPermissions,
    contributors,
    clock,
    events
  );
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
    expect(events.collected()).toEqual([
      new TodoListAccessGranted(
        todoListId,
        contributorId,
        "contributor/new",
        clock.now()
      ),
    ]);
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}
