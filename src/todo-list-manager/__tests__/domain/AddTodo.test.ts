import type { GenerateId } from "shared/id";
import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import type { TodoListPermissions } from "../../domain/TodoListPermissions";
import { Clock, FixedClock } from "shared/time";
import { GenerateTestId } from "shared/id";
import { AddTodo } from "../../usecase/AddTodo";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let addTodo: AddTodo;
let todos: Todos;
let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;
let generateId: GenerateId;
let clock: Clock;

beforeEach(() => {
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  todos = new TodosInMemory();
  generateId = new GenerateTestId("todo");
  clock = new FixedClock();
  addTodo = new AddTodo(
    todos,
    todoLists,
    todoListPermissions,
    generateId,
    clock
  );
});

it("adding a todo requires having permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoLists/1").forOwner("owner/1")
  );

  await expect(
    addTodo.execute(
      "todoLists/1",
      "Some random title",
      "collaborator/unauthorized"
    )
  ).rejects.toEqual(
    new TodoListPermissionDenied("todoLists/1", "collaborator/unauthorized")
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
  it(`should a new todo to an existing todo list (role=${role})`, async () => {
    await Promise.all([
      givenTodoList(aTodoList().withId(todoListId).withTodosOrder("todo/0")),
      givenPermission(permission),
    ]);

    await addTodo.execute(todoListId, "Buy cereals", collaboratorId);

    const [todo] = await todos.ofTodoList(todoListId);
    const todoList = await todoLists.ofId(todoListId);
    expect(todo).toEqual({
      id: "todo/1",
      todoListId,
      createdAt: "2022-01-05T12:00:00.000Z",
      isComplete: false,
      title: "Buy cereals",
      tags: [],
    });
    expect(todoList.todosOrder).toEqual(["todo/0", "todo/1"]);
  })
);

function givenPermission(permission: TodoListPermissionBuilder) {
  return todoListPermissions.save(permission.build());
}

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}
