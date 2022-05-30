import { ShareTodoList } from "../../usecase/ShareTodoList";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import {
  aTodoListPermission,
  TodoListPermissionBuilder,
} from "./builders/TodoListPermission";
import { TodoListPermissionDeniedError } from "../../domain/TodoListPermissionDeniedError";
import { CollaboratorsInMemory } from "./fakes/CollaboratorsInMemory";

let shareTodoList: ShareTodoList;
let todoListPermissions: TodoListPermissionsInMemory;
let collaborators: CollaboratorsInMemory;

beforeEach(() => {
  todoListPermissions = new TodoListPermissionsInMemory();
  collaborators = new CollaboratorsInMemory();
  shareTodoList = new ShareTodoList(todoListPermissions, collaborators);
});

it("sharing todo list requires permissions", async () => {
  await givenPermission(
    aTodoListPermission()
      .forTodoList("todoList/1")
      .forOwner("collaborator/owner")
  );

  await expect(
    shareTodoList.execute(
      "todoList/1",
      "collaborator/not-authorized",
      "john.doe@example.com"
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
  it(`authorizes new collaborators (role=${role})`, async () => {
    // Arrange
    collaborators.addTestCollaborator({
      id: "collaborator/new",
      email: "john.doe@example.com",
    });
    await givenPermission(permission);

    await shareTodoList.execute(
      todoListId,
      collaboratorId,
      "john.doe@example.com"
    );
    await shareTodoList.execute(
      // Execute twice to check for duplicates
      todoListId,
      collaboratorId,
      "john.doe@example.com"
    );

    expect(await todoListPermissions.ofTodoList(todoListId)).toEqual(
      permission.withMoreCollaboratorsAuthorized("collaborator/new").build()
    );
  })
);

function givenPermission(todoListPermission: TodoListPermissionBuilder) {
  return todoListPermissions.save(todoListPermission.build());
}
