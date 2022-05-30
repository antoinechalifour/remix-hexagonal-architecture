import { Todos } from "../../domain/Todos";
import { TagTodo } from "../../usecase/TagTodo";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo, TodoBuilder } from "./builders/Todo";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let todos: Todos;
let todoListPermissions: TodoListPermissions;
let tagTodo: TagTodo;

beforeEach(() => {
  todos = new TodosInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  tagTodo = new TagTodo(todos, todoListPermissions);
});

it("tagging todos requires permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    tagTodo.execute(
      "todoList/1",
      "todo/1",
      "collaborator/not-authorized",
      "feature"
    )
  ).rejects.toEqual(
    new TodoListPermissionDenied("todoList/1", "collaborator/not-authorized")
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
  it(`adds new tags to the todo (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodo(aTodo().withId("todo/1")),
    ]);

    await tagTodo.execute(todoListId, "todo/1", collaboratorId, "feature");
    await tagTodo.execute(todoListId, "todo/1", collaboratorId, "top priority");
    await tagTodo.execute(todoListId, "todo/1", collaboratorId, "feature"); // Check for duplicates

    expect((await todos.ofId("todo/1")).tags).toEqual([
      "feature",
      "top priority",
    ]);
  })
);

it("is limited to 3 tags", async () => {
  await Promise.all([
    givenPermission(
      aTodoListPermission()
        .forTodoList("todoList/1")
        .forOwner("collaborator/owner")
    ),
    givenTodo(aTodo().withId("todo/1").taggedAs("tag 1", "tag 2", "tag 3")),
  ]);

  await expect(
    tagTodo.execute("todoList/1", "todo/1", "collaborator/owner", "tag 4")
  ).rejects.toEqual(new Error("Todos can only have at most 3 tags"));
});

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodo(todo: TodoBuilder) {
  return todos.save(todo.build());
}
