import { CollectEvents } from "shared/events";
import { FixedClock } from "shared/time";
import { RevokeAccess } from "../../usecase/RevokeAccess";
import { TodoListPermissionDeniedError } from "../../domain/error/TodoListPermissionDeniedError";
import { TodoListAccessRevoked } from "../../domain/event/TodoListAccessRevoked";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

jest.mock("uuid", () => ({
  v4: () => "e775b0c1-7622-40df-a329-95f83b260c80",
}));

let revokeAccess: RevokeAccess;
let todoListPermissions: TodoListPermissionsInMemory;
let events: CollectEvents;
let clock: FixedClock;

beforeEach(() => {
  todoListPermissions = new TodoListPermissionsInMemory();
  events = new CollectEvents();
  clock = new FixedClock();
  revokeAccess = new RevokeAccess(todoListPermissions, clock, events);
});

it("revoking access to a todo list requires permissions", async () => {
  await givenPermission(
    aTodoListPermission()
      .forTodoList("todoList/1")
      .forOwner("contributor/owner")
  );

  await expect(
    revokeAccess.execute("todoList/1", "contributor/2", "contributor/1")
  ).rejects.toEqual(
    new TodoListPermissionDeniedError("todoList/1", "contributor/2")
  );
});

const AUTHORIZED_CASES = [
  {
    role: "authorized contributor",
    todoListId: "todoList/1",
    contributorId: "contributor/2",
    permission: aTodoListPermission()
      .forTodoList("todoList/1")
      .withContributors("contributor/1", "contributor/2"),
  },
  {
    role: "owner",
    todoListId: "todoList/2",
    contributorId: "contributor/owner",
    permission: aTodoListPermission()
      .forTodoList("todoList/2")
      .forOwner("contributor/owner")
      .withContributors("contributor/1", "contributor/2"),
  },
];

AUTHORIZED_CASES.forEach(({ role, todoListId, contributorId, permission }) =>
  it(`revokes access for the given contributor (role=${role})`, async () => {
    // Arrange
    await givenPermission(permission);

    await revokeAccess.execute(todoListId, contributorId, "contributor/1");

    expect(await todoListPermissions.ofTodoList(todoListId)).toEqual(
      permission.withContributors("contributor/2").build()
    );
    expect(events.collected()).toEqual([
      new TodoListAccessRevoked(
        todoListId,
        contributorId,
        "contributor/1",
        clock.now()
      ),
    ]);
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}
