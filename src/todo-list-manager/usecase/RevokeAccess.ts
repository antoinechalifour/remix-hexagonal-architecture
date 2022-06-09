import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListId } from "../domain/TodoList";
import type { ContributorId } from "../domain/ContributorId";
import { canShareTodoList, revokeAccess } from "../domain/TodoListPermission";
import { AccessRevoked } from "../domain/AccessRevoked";

export class RevokeAccess {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly clock: Clock,
    private readonly events: Events
  ) {}

  async execute(
    todoListId: TodoListId,
    ownerId: ContributorId,
    contributorToRevokeAccess: ContributorId
  ) {
    const permissions = await this.todoListPermissions.ofTodoList(todoListId);
    canShareTodoList(permissions, ownerId);

    await this.todoListPermissions.save(
      revokeAccess(permissions, contributorToRevokeAccess)
    );
    this.events.publish(
      new AccessRevoked(
        todoListId,
        ownerId,
        contributorToRevokeAccess,
        this.clock.now()
      )
    );
  }
}
