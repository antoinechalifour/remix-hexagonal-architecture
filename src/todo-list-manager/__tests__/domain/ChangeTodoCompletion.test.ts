import type { Todos } from "../../domain/Todos";
import type { TodoLists } from "../../domain/TodoLists";
import { ChangeTodoCompletion } from "../../usecase/ChangeTodoCompletion";
import { TodoListPermissions } from "../../domain/TodoListPermissions";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";
import { TodosInMemory } from "./fakes/TodosInMemory";
import { TodoListsInMemory } from "./fakes/TodoListsInMemory";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodo, TodoBuilder } from "./builders/Todo";
import { aTodoList, TodoListBuilder } from "./builders/TodoList";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";

let changeTodoCompletion: ChangeTodoCompletion;
let todoLists: TodoLists;
let todoListPermissions: TodoListPermissions;
let todos: Todos;

beforeEach(() => {
  todos = new TodosInMemory();
  todoLists = new TodoListsInMemory();
  todoListPermissions = new TodoListPermissionsInMemory();
  changeTodoCompletion = new ChangeTodoCompletion(
    todoLists,
    todoListPermissions,
    todos
  );
});

it("changing completion requires permission", async () => {
  await givenPermission(
    aTodoListPermission().forTodoList("todoList/1").forOwner("owner/1")
  );

  await expect(
    changeTodoCompletion.execute("todoList/1", "todo/1", "on", "collaborator/1")
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
  it(`should complete the todo and move it to the end of the list (role=${role})`, async () => {
    await Promise.all([
      givenPermission(permission),
      givenTodoList(
        aTodoList()
          .withId(todoListId)
          .withTodosOrder("todo/1", "todo/2", "todo/3")
      ),
      givenTodo(aTodo().withId("todo/1").uncompleted().ofTodoList(todoListId)),
    ]);

    await changeTodoCompletion.execute(
      todoListId,
      "todo/1",
      "on",
      collaboratorId
    );

    expect((await todos.ofId("todo/1")).isComplete).toBe(true);
    expect((await todoLists.ofId(todoListId)).todosOrder).toEqual([
      "todo/2",
      "todo/3",
      "todo/1",
    ]);
  })
);

AUTHORIZED_CASES.forEach(({ role, todoListId, collaboratorId, permission }) =>
  it(`should uncomplete the todo and move it to the beggining of the list (role=${role})`, async () => {
    // Arrange
    await Promise.all([
      givenPermission(permission),
      givenTodoList(
        aTodoList()
          .withId(todoListId)
          .withTodosOrder("todo/3", "todo/2", "todo/1")
      ),
      givenTodo(aTodo().completed().withId("todo/1").ofTodoList(todoListId)),
    ]);

    await changeTodoCompletion.execute(
      todoListId,
      "todo/1",
      "off",
      collaboratorId
    );

    expect((await todos.ofId("todo/1")).isComplete).toBe(false);
    expect((await todoLists.ofId(todoListId)).todosOrder).toEqual([
      "todo/1",
      "todo/3",
      "todo/2",
    ]);
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}

function givenTodo(todo: TodoBuilder) {
  return todos.save(todo.build());
}

function givenTodoList(todoList: TodoListBuilder) {
  return todoLists.save(todoList.build());
}
