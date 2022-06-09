import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import { CollectEvents } from "../../../shared/events/CollectEvents";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { DeleteTodoFromTodoList } from "../../usecase/DeleteTodoFromTodoList";
import { TodoListUpdated } from "../../domain/TodoListUpdated";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import { aTodo, TodoBuilder } from "./builders/Todo";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let deleteTodoFromTodoList: DeleteTodoFromTodoList;
let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;
let todos: Todos;
let events: CollectEvents;

beforeEach(() => {
  todos = new TodosInMemory();
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  events = new CollectEvents();
  deleteTodoFromTodoList = new DeleteTodoFromTodoList(
    todoLists,
    todoListPermissions,
    todos,
    events
  );
});

it("archiving a todo requires having permission", async () => {
  await givenPermission(
    aTodoListPermission()
      .forTodoList("todoLists/1")
      .forOwner("contributor/owner")
  );

  await expect(
    deleteTodoFromTodoList.execute(
      "todoLists/1",
      "todos/1",
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
  it(`should delete the todo from the todo list (role=${role})`, async () => {
    const todoToRemove = aTodo().withId("todos/1").ofTodoList(todoListId);
    const todoToKeep = aTodo().withId("todos/2").ofTodoList(todoListId);
    await Promise.all([
      givenTodoList(
        aTodoList().withId(todoListId).withTodosOrder("todos/1", "todos/2")
      ),
      givenPermission(permission),
      givenTodos(todoToRemove, todoToKeep),
    ]);

    await deleteTodoFromTodoList.execute(todoListId, "todos/1", contributorId);

    const todoList = await todoLists.ofId(todoListId);
    expect(await todos.ofTodoList(todoListId)).toEqual([todoToKeep.build()]);
    expect(todoList.todosOrder).toEqual(["todos/2"]);
    expect(events.collected()).toEqual([
      new TodoListUpdated(todoListId, contributorId),
    ]);
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}

function givenTodos(...todosToSave: TodoBuilder[]) {
  return Promise.all(todosToSave.map((todo) => todos.save(todo.build())));
}
