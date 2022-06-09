import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { FixedClock } from "shared/time";
import { CollectEvents } from "shared/events";
import { UpdateTodoListTitle } from "../../usecase/UpdateTodoListTitle";
import { TodoListUpdated } from "../../domain/TodoListUpdated";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;
let clock: FixedClock;
let events: CollectEvents;
let updateTodoListTitle: UpdateTodoListTitle;

beforeEach(() => {
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  clock = new FixedClock();
  events = new CollectEvents();
  updateTodoListTitle = new UpdateTodoListTitle(
    todoLists,
    todoListPermissions,
    clock,
    events
  );
});

it("renaming a todo list requires permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    updateTodoListTitle.execute("todoList/1", "Updated title", "contributor/1")
  ).rejects.toEqual(
    new TodoListPermissionDeniedError("todoList/1", "contributor/1")
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
  it(`renames the todo list (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodoList(aTodoList().withId(todoListId).withTitle("Current title")),
    ]);

    await updateTodoListTitle.execute(
      todoListId,
      "Updated title",
      contributorId
    );

    expect((await todoLists.ofId(todoListId)).title).toEqual("Updated title");
    expect(events.collected()).toEqual([
      new TodoListUpdated(
        todoListId,
        contributorId,
        {
          title: {
            previous: "Current title",
            current: "Updated title",
          },
        },
        clock.now()
      ),
    ]);
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}
