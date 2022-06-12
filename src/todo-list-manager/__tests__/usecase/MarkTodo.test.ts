import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import { Clock, FixedClock } from "shared/time";
import { CollectEvents } from "shared/events";
import { MarkTodo } from "../../usecase/MarkTodo";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { TodoListPermissionDeniedError } from "../../domain/error/TodoListPermissionDeniedError";
import { TodoCompletionChanged } from "../../domain/event/TodoCompletionChanged";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo, TodoBuilder } from "./builders/Todo";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

jest.mock("uuid", () => ({
  v4: () => "e775b0c1-7622-40df-a329-95f83b260c80",
}));

let markTodo: MarkTodo;
let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;
let todos: Todos;
let clock: Clock;
let events: CollectEvents;

beforeEach(() => {
  clock = new FixedClock();
  todos = new TodosInMemory();
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  events = new CollectEvents();
  markTodo = new MarkTodo(todoLists, todoListPermissions, todos, clock, events);
});

it("changing completion requires permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    markTodo.execute("todoList/1", "todo/1", true, "contributorId")
  ).rejects.toEqual(
    new TodoListPermissionDeniedError("todoList/1", "contributorId")
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
  it(`should mark the todo as done (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodoList(
        aTodoList()
          .withId(todoListId)
          .withTodosOrder("todo/1", "todo/2", "todo/3")
      ),
      givenTodo(aTodo().withId("todo/1").uncompleted().ofTodoList(todoListId)),
    ]);

    await markTodo.execute(todoListId, "todo/1", true, contributorId);

    expect((await todos.ofId("todo/1")).isDone).toBe(true);
    expect((await todos.ofId("todo/1")).doneAt).toBe(clock.now());
    expect((await todoLists.ofId(todoListId)).todosOrder).toEqual([
      "todo/2",
      "todo/3",
    ]);
    expect(events.collected()).toEqual([
      new TodoCompletionChanged(
        todoListId,
        contributorId,
        "todo/1",
        "done",
        clock.now()
      ),
    ]);
  })
);

AUTHORIZED_CASES.forEach(({ role, todoListId, contributorId, permission }) =>
  it(`should mark the todo as doing and move it to the beginning of the list (role=${role})`, async () => {
    // Arrange
    await Promise.all([
      givenPermission(permission),
      givenTodoList(
        aTodoList().withId(todoListId).withTodosOrder("todo/3", "todo/2")
      ),
      givenTodo(
        aTodo()
          .completed({ at: new Date() })
          .withId("todo/1")
          .ofTodoList(todoListId)
      ),
    ]);

    await markTodo.execute(todoListId, "todo/1", false, contributorId);

    expect((await todos.ofId("todo/1")).isDone).toBe(false);
    expect((await todos.ofId("todo/1")).doneAt).toBe(null);
    expect((await todoLists.ofId(todoListId)).todosOrder).toEqual([
      "todo/1",
      "todo/3",
      "todo/2",
    ]);
    expect(events.collected()).toEqual([
      new TodoCompletionChanged(
        todoListId,
        contributorId,
        "todo/1",
        "doing",
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

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}
