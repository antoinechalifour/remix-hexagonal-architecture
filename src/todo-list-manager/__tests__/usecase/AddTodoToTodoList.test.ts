import type { GenerateId } from "shared/id";
import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { Clock, FixedClock } from "shared/time";
import { GenerateTestId } from "shared/id";
import { CollectEvents } from "../../../shared/events/CollectEvents";
import { TodoListUpdated } from "../../domain/TodoListUpdated";
import { AddTodoToTodoList } from "../../usecase/AddTodoToTodoList";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let addTodoToTodoList: AddTodoToTodoList;
let todos: Todos;
let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;
let generateId: GenerateId;
let clock: Clock;
let events: CollectEvents;

beforeEach(() => {
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  todos = new TodosInMemory();
  generateId = new GenerateTestId("todo");
  clock = new FixedClock();
  events = new CollectEvents();
  addTodoToTodoList = new AddTodoToTodoList(
    todos,
    todoLists,
    todoListPermissions,
    generateId,
    clock,
    events
  );
});

it("adding a todo requires having permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoLists/1").forOwner("owner/1")
  );

  await expect(
    addTodoToTodoList.execute(
      "todoLists/1",
      "Some random title",
      "contributor/unauthorized"
    )
  ).rejects.toEqual(
    new TodoListPermissionDeniedError("todoLists/1", "contributor/unauthorized")
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
  it(`should a new todo to an existing todo list (role=${role})`, async () => {
    await Promise.all([
      givenTodoList(aTodoList().withId(todoListId).withTodosOrder("todo/0")),
      givenPermission(permission),
    ]);

    await addTodoToTodoList.execute(todoListId, "Buy cereals", contributorId);

    const [todo] = await todos.ofTodoList(todoListId);
    const todoList = await todoLists.ofId(todoListId);
    expect(todo).toEqual({
      id: "todo/1",
      todoListId,
      createdAt: clock.now(),
      isDone: false,
      doneAt: null,
      title: "Buy cereals",
      tags: [],
    });
    expect(todoList.todosOrder).toEqual(["todo/0", "todo/1"]);
    expect(events.collected()).toEqual([
      new TodoListUpdated(todoListId, contributorId),
    ]);
  })
);

function givenPermission(permission: TodoListPermissionBuilder) {
  return todoListPermissions.save(permission.build());
}

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}
