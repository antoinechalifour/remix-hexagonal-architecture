import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import type { Todos } from "../../domain/Todos";
import { FixedClock } from "shared/time";
import { CollectEvents } from "shared/events";
import { UpdateTodoTitle } from "../../usecase/UpdateTodoTitle";
import { TodoUpdated } from "../../domain/event/TodoUpdated";
import { TodoListPermissionDeniedError } from "../../domain/error/TodoListPermissionDeniedError";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo, TodoBuilder } from "./builders/Todo";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

jest.mock("uuid", () => ({
  v4: () => "e775b0c1-7622-40df-a329-95f83b260c80",
}));

let todos: Todos;
let todoListPermissions: TodoListPermissions;
let clock: FixedClock;
let events: CollectEvents;
let updateTodoTitle: UpdateTodoTitle;

beforeEach(() => {
  todos = new TodosInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  clock = new FixedClock();
  events = new CollectEvents();
  updateTodoTitle = new UpdateTodoTitle(
    todos,
    todoListPermissions,
    clock,
    events
  );
});

it("updating a todo title requires permission", async () => {
  // Arrange
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    updateTodoTitle.execute(
      "todoList/1",
      "todo/1",
      "Updated title",
      "contributor/1"
    )
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
  it(`updates the todo title (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodo(aTodo().withId("todo/1").withTitle("Current title")),
    ]);

    await updateTodoTitle.execute(
      todoListId,
      "todo/1",
      "Updated title",
      contributorId
    );

    expect((await todos.ofId("todo/1")).title).toEqual("Updated title");
    expect(events.collected()).toEqual([
      new TodoUpdated(
        todoListId,
        contributorId,
        "todo/1",
        {
          title: { previous: "Current title", current: "Updated title" },
        },
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
