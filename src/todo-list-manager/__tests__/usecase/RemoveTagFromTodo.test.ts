import type { Todos } from "../../domain/Todos";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { FixedClock } from "shared/time";
import { CollectEvents } from "shared/events";
import { RemoveTagFromTodo } from "../../usecase/RemoveTagFromTodo";
import { TagRemovedFromTodo } from "../../domain/event/TagRemovedFromTodo";
import { TodoListPermissionDeniedError } from "../../domain/error/TodoListPermissionDeniedError";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo, TodoBuilder } from "./builders/Todo";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let todos: Todos;
let todoListPermissions: TodoListPermissions;
let events: CollectEvents;
let clock: FixedClock;
let removeTagFromTodo: RemoveTagFromTodo;

jest.mock("uuid", () => ({
  v4: () => "e775b0c1-7622-40df-a329-95f83b260c80",
}));

beforeEach(() => {
  todos = new TodosInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  clock = new FixedClock();
  events = new CollectEvents();
  removeTagFromTodo = new RemoveTagFromTodo(
    todos,
    todoListPermissions,
    clock,
    events
  );
});

it("removing tag from todos requires permission", async () => {
  await givenPermission(
    aTodoListPermission()
      .forTodoList("todoList/1")
      .forOwner("contributor/owner")
  );

  await expect(
    removeTagFromTodo.execute(
      "todoList/1",
      "todo/1",
      "contributor/not-authorized",
      "top priority"
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
  it(`remove the given tag from the tags (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodo(
        aTodo()
          .withId("todo/1")
          .taggedAs("feature", "top priority", "research required")
      ),
    ]);

    await removeTagFromTodo.execute(
      todoListId,
      "todo/1",
      contributorId,
      "top priority"
    );

    expect((await todos.ofId("todo/1")).tags).toEqual([
      "feature",
      "research required",
    ]);
    expect(events.collected()).toEqual([
      new TagRemovedFromTodo(
        todoListId,
        contributorId,
        "todo/1",
        "top priority",
        clock.now()
      ),
    ]);
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodo(todo: TodoBuilder) {
  return todos.save(todo.build());
}
