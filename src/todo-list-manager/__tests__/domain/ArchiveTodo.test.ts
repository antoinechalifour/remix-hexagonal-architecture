import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { ArchiveTodo } from "../../usecase/ArchiveTodo";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import { aTodo, TodoBuilder } from "./builders/Todo";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let archiveTodo: ArchiveTodo;
let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;
let todos: Todos;

beforeEach(() => {
  todos = new TodosInMemory();
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  archiveTodo = new ArchiveTodo(todoLists, todoListPermissions, todos);
});

it("archiving a todo requires having permission", async () => {
  await givenPermission(
    aTodoListPermission()
      .forTodoList("todoLists/1")
      .forOwner("collaborator/owner")
  );

  await expect(
    archiveTodo.execute("todoLists/1", "todos/1", "collaborator/unauthorized")
  ).rejects.toEqual(
    new TodoListPermissionDeniedError(
      "todoLists/1",
      "collaborator/unauthorized"
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
  it(`should remove the todo from the todo list (role=${role})`, async () => {
    const todoToRemove = aTodo().withId("todos/1").ofTodoList(todoListId);
    const todoToKeep = aTodo().withId("todos/2").ofTodoList(todoListId);
    await Promise.all([
      givenTodoList(
        aTodoList().withId(todoListId).withTodosOrder("todos/1", "todos/2")
      ),
      givenPermission(permission),
      givenTodos(todoToRemove, todoToKeep),
    ]);

    await archiveTodo.execute(todoListId, "todos/1", collaboratorId);

    const todoList = await todoLists.ofId(todoListId);
    expect(await todos.ofTodoList(todoListId)).toEqual([todoToKeep.build()]);
    expect(todoList.todosOrder).toEqual(["todos/2"]);
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
