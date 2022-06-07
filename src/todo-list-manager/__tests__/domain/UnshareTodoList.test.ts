import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { UnshareTodoList } from "../../usecase/UnshareTodoList";

let unshareTodoList: UnshareTodoList;
let todoListPermissions: TodoListPermissionsInMemory;

beforeEach(() => {
  todoListPermissions = new TodoListPermissionsInMemory();
  unshareTodoList = new UnshareTodoList(todoListPermissions);
});

it("sharing todo list requires permissions", async () => {
  await givenPermission(
    aTodoListPermission()
      .forTodoList("todoList/1")
      .forOwner("collaborator/owner")
  );

  await expect(
    unshareTodoList.execute("todoList/1", "collaborator/2", "collaborator/1")
  ).rejects.toEqual(
    new TodoListPermissionDeniedError("todoList/1", "collaborator/2")
  );
});

const AUTHORIZED_CASES = [
  {
    role: "authorized collaborator",
    todoListId: "todoList/1",
    collaboratorId: "collaborator/2",
    permission: aTodoListPermission()
      .forTodoList("todoList/1")
      .withCollaboratorsAuthorized("collaborator/1", "collaborator/2"),
  },
  {
    role: "owner",
    todoListId: "todoList/2",
    collaboratorId: "collaborator/owner",
    permission: aTodoListPermission()
      .forTodoList("todoList/2")
      .forOwner("collaborator/owner")
      .withCollaboratorsAuthorized("collaborator/1", "collaborator/2"),
  },
];

AUTHORIZED_CASES.forEach(({ role, todoListId, collaboratorId, permission }) =>
  it(`authorizes new collaborators (role=${role})`, async () => {
    // Arrange
    await givenPermission(permission);

    await unshareTodoList.execute(todoListId, collaboratorId, "collaborator/1");

    expect(await todoListPermissions.ofTodoList(todoListId)).toEqual(
      permission.withCollaboratorsAuthorized("collaborator/2").build()
    );
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}
