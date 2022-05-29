import type { Collaborators } from "../../domain/Collaborators";
import type { Collaborator } from "../../domain/Collaborator";
import type { CollaboratorId } from "../../domain/CollaboratorId";
import { ShareTodoList } from "../../usecase/ShareTodoList";
import { TodoListPermissionsInMemory } from "./fakes/TodoListPermissionsInMemory";
import { aTodoListPermission } from "./builders/TodoListPermission";
import { TodoListPermissionDenied } from "../../domain/TodoListPermissionDenied";

class CollaboratorsInMemory implements Collaborators {
  private database = new Map<CollaboratorId, Collaborator>();
  private databaseByEmail = new Map<string, Collaborator>();

  addTestCollaborator(collaborator: Collaborator) {
    this.database.set(collaborator.id, collaborator);
    this.databaseByEmail.set(collaborator.email, collaborator);
  }

  async ofEmail(email: string): Promise<Collaborator> {
    const collaborator = this.databaseByEmail.get(email);
    if (collaborator == null) throw new Error("oups");

    return collaborator;
  }
}

describe("ShareTodoList", () => {
  let shareTodoList: ShareTodoList;
  let todoListPermissions: TodoListPermissionsInMemory;
  let collaborators: CollaboratorsInMemory;

  beforeEach(() => {
    todoListPermissions = new TodoListPermissionsInMemory();
    collaborators = new CollaboratorsInMemory();
    shareTodoList = new ShareTodoList(todoListPermissions, collaborators);
  });

  it("Only owners can share todo lists", async () => {
    // Arrange
    const theTodoListId = "todoList/1";
    const theCollaboratorId = "collaborator/1";
    await todoListPermissions.save(
      aTodoListPermission()
        .forTodoList(theTodoListId)
        .forOwner("owner/1")
        .build()
    );

    // Act
    const result = shareTodoList.execute(
      theTodoListId,
      theCollaboratorId,
      "john.doe@example.com"
    );

    // Assert
    await expect(result).rejects.toEqual(
      new TodoListPermissionDenied(theTodoListId, theCollaboratorId)
    );
  });

  it("Authorizes new collaborators", async () => {
    // Arrange
    collaborators.addTestCollaborator({
      id: "collaborator/2",
      email: "john.doe@example.com",
    });
    const theTodoListId = "todoList/1";
    const theCollaboratorId = "collaborator/1";
    await todoListPermissions.save(
      aTodoListPermission()
        .forTodoList(theTodoListId)
        .forOwner("owner/1")
        .withCollaboratorsAuthorized("collaborator/1")
        .build()
    );

    // Act
    await shareTodoList.execute(
      theTodoListId,
      theCollaboratorId,
      "john.doe@example.com"
    );

    // Assert
    expect(await todoListPermissions.ofTodoList(theTodoListId)).toEqual({
      collaboratorsIds: ["collaborator/1", "collaborator/2"],
      ownerId: "owner/1",
      todoListId: "todoList/1",
    });
  });
});
