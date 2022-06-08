import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import type { TodoLists } from "../../domain/TodoLists";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { ArchiveTodoList } from "../../usecase/ArchiveTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let archiveTodoList: ArchiveTodoList;
let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;

beforeEach(() => {
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  archiveTodoList = new ArchiveTodoList(todoLists, todoListPermissions);
});

const UNAUTHORIZED_CASES = [
  {
    role: "non contributor",
    todoListId: "todoList/1",
    contributorId: "not-a-contributor",
    permission: aTodoListPermission().forTodoList("todoList/1"),
  },
  {
    role: "contributor",
    todoListId: "todoList/2",
    contributorId: "contributor/1",
    permission: aTodoListPermission()
      .forTodoList("todoList/2")
      .withContributors("contributor/1"),
  },
];

UNAUTHORIZED_CASES.forEach(({ role, todoListId, contributorId, permission }) =>
  it(`only the owner can archive a todo list (role=${role})`, async () => {
    await givenPermission(permission);

    await expect(
      archiveTodoList.execute(todoListId, contributorId)
    ).rejects.toEqual(
      new TodoListPermissionDeniedError(todoListId, contributorId)
    );
  })
);

it("should archive the todo list", async () => {
  await Promise.all([
    givenTodoList(aTodoList().withId("todoList/1")),
    givenPermission(
      aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
    ),
  ]);

  await archiveTodoList.execute("todoList/1", "owner/1");

  await expect(todoLists.ofId("todoList/1")).rejects.toThrow(
    new Error("Todolist todoList/1 not found")
  );
  await expect(todoListPermissions.ofTodoList("todoList/1")).rejects.toThrow(
    new Error("Not permissions found for todolist todoList/1")
  );
});

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}
