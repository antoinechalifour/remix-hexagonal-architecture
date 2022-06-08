import { Todos } from "../../domain/Todos";
import { AddTagToTodo } from "../../usecase/AddTagToTodo";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo, TodoBuilder } from "./builders/Todo";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let todos: Todos;
let todoListPermissions: TodoListPermissions;
let addTagToTodo: AddTagToTodo;

beforeEach(() => {
  todos = new TodosInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  addTagToTodo = new AddTagToTodo(todos, todoListPermissions);
});

it("adding a tag to a todo requires permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    addTagToTodo.execute(
      "todoList/1",
      "todo/1",
      "contributor/not-authorized",
      "feature"
    )
  ).rejects.toEqual(
    new TodoListPermissionDeniedError(
      "todoList/1",
      "contributor/not-authorized"
    )
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
  it(`adds new tags to the todo (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodo(aTodo().withId("todo/1")),
    ]);

    await addTagToTodo.execute(todoListId, "todo/1", contributorId, "feature");
    await addTagToTodo.execute(
      todoListId,
      "todo/1",
      contributorId,
      "top priority"
    );
    await addTagToTodo.execute(todoListId, "todo/1", contributorId, "feature"); // Check for duplicates

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
        .forOwner("contributor/owner")
    ),
    givenTodo(aTodo().withId("todo/1").taggedAs("tag 1", "tag 2", "tag 3")),
  ]);

  await expect(
    addTagToTodo.execute("todoList/1", "todo/1", "contributor/owner", "tag 4")
  ).rejects.toEqual(new Error("Todos can only have at most 3 tags"));
});

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodo(todo: TodoBuilder) {
  return todos.save(todo.build());
}
