import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { RenameTodoList } from "../../usecase/RenameTodoList";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";

let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;
let renameTodoList: RenameTodoList;

beforeEach(() => {
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  renameTodoList = new RenameTodoList(todoLists, todoListPermissions);
});

it("renaming a todo list requires permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    renameTodoList.execute("todoList/1", "Updated title", "collaborator/1")
  ).rejects.toEqual(
    new TodoListPermissionDenied("todoList/1", "collaborator/1")
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
  it(`renames the todo list (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodoList(aTodoList().withId(todoListId).withTitle("Current title")),
    ]);

    await renameTodoList.execute(todoListId, "Updated title", collaboratorId);

    expect((await todoLists.ofId(todoListId)).title).toEqual("Updated title");
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}
