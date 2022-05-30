import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import type { Todos } from "../../domain/Todos";
import { RenameTodo } from "../../usecase/RenameTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo, TodoBuilder } from "./builders/Todo";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";

let todos: Todos;
let todoListPermissions: TodoListPermissions;
let renameTodo: RenameTodo;

beforeEach(() => {
  todos = new TodosInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  renameTodo = new RenameTodo(todos, todoListPermissions);
});

it("renming a todo requires permission", async () => {
  // Arrange
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    renameTodo.execute(
      "todoList/1",
      "todo/1",
      "Updated title",
      "collaborator/1"
    )
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
      givenTodo(aTodo().withId("todo/1").withTitle("Current title")),
    ]);

    await renameTodo.execute(
      todoListId,
      "todo/1",
      "Updated title",
      collaboratorId
    );

    expect((await todos.ofId("todo/1")).title).toEqual("Updated title");
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodo(todo: TodoBuilder) {
  return todos.save(todo.build());
}
