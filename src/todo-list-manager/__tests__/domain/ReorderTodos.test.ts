import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { ReorderTodos } from "../../usecase/ReorderTodos";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";

let reorderTodos: ReorderTodos;
let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;

beforeEach(() => {
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  reorderTodos = new ReorderTodos(todoLists, todoListPermissions);
});

it("reordering todos requires permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    reorderTodos.execute("todoList/1", "collaborator/1", "todo/2", 3)
  ).rejects.toEqual(
    new TodoListPermissionDeniedError("todoList/1", "collaborator/1")
  );
});

const AUTHORIZED_CASES = [
  {
    role: "authorized collaborator",
    todoListId: "todoList/1",
    collaboratorId: "collaborator/authorized",
    permission: aTodoListPermission()
      .forTodoList("todoList/1")
      .withCollaboratorsAuthorized("collaborator/authorized"),
  },
  {
    role: "owner",
    todoListId: "todoList/2",
    collaboratorId: "collaborator/owner",
    permission: aTodoListPermission()
      .forTodoList("todoList/2")
      .forOwner("collaborator/owner"),
  },
];

AUTHORIZED_CASES.forEach(({ role, todoListId, collaboratorId, permission }) =>
  it(`places the todo at the given index (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodoList(
        aTodoList()
          .withId(todoListId)
          .withTodosOrder("todo/1", "todo/2", "todo/3", "todo/4")
      ),
    ]);

    await reorderTodos.execute(todoListId, collaboratorId, "todo/2", 3);

    const reorderedTodoList = await todoLists.ofId(todoListId);
    expect(reorderedTodoList.todosOrder).toEqual([
      "todo/1",
      "todo/3",
      "todo/4",
      "todo/2",
    ]);
  })
);

it("throws when the index is out of bounds (negative)", async () => {
  await Promise.all([
    givenPermission(
      aTodoListPermission()
        .forTodoList("todoList/1")
        .forOwner("collaborator/owner")
    ),
    givenTodoList(
      aTodoList().withId("todoList/1").withTodosOrder("todo/1", "todo/2")
    ),
  ]);

  return expect(() =>
    reorderTodos.execute("todoList/1", "collaborator/owner", "todo/1", -1)
  ).rejects.toThrow("Index -1 is out of bounds");
});

it("throws when the index is out of bounds (after)", async () => {
  await Promise.all([
    givenPermission(
      aTodoListPermission()
        .forTodoList("todoList/1")
        .forOwner("collaborator/owner")
    ),
    givenTodoList(
      aTodoList().withId("todoList/1").withTodosOrder("todo/1", "todo/2")
    ),
  ]);

  return expect(() =>
    reorderTodos.execute("todoList/1", "collaborator/owner", "todo/1", 2)
  ).rejects.toThrow("Index 2 is out of bounds");
});

it("throws when the todo doesn't belong the todo list", async () => {
  await Promise.all([
    givenPermission(
      aTodoListPermission()
        .forTodoList("todoList/1")
        .forOwner("collaborator/owner")
    ),
    givenTodoList(
      aTodoList().withId("todoList/1").withTodosOrder("todo/1", "todo/2")
    ),
  ]);

  return expect(() =>
    reorderTodos.execute("todoList/1", "collaborator/owner", "todo/999", 1)
  ).rejects.toThrow("Todo todo/999 not found");
});

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}
