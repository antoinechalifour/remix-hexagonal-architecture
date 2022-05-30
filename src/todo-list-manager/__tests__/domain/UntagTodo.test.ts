import type { Todos } from "../../domain/Todos";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { UntagTodo } from "../../usecase/UntagTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo, TodoBuilder } from "./builders/Todo";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let todos: Todos;
let todoListPermissions: TodoListPermissions;
let untagTodo: UntagTodo;

beforeEach(() => {
  todos = new TodosInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  untagTodo = new UntagTodo(todos, todoListPermissions);
});

it("untagging todos requires permission", async () => {
  await givenPermission(
    aTodoListPermission()
      .forTodoList("todoList/1")
      .forOwner("collaborator/owner")
  );

  await expect(
    untagTodo.execute(
      "todoList/1",
      "todo/1",
      "collaborator/not-authorized",
      "top priority"
    )
  ).rejects.toEqual(
    new TodoListPermissionDeniedError(
      "todoList/1",
      "collaborator/not-authorized"
    )
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
  it(`remove the given tag from the tags (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodo(
        aTodo()
          .withId("todo/1")
          .taggedAs("feature", "top priority", "research required")
      ),
    ]);

    await untagTodo.execute(
      todoListId,
      "todo/1",
      collaboratorId,
      "top priority"
    );

    expect((await todos.ofId("todo/1")).tags).toEqual([
      "feature",
      "research required",
    ]);
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodo(todo: TodoBuilder) {
  return todos.save(todo.build());
}
