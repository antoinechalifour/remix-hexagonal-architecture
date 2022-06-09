import type { Events } from "shared/events";
import type { Clock } from "shared/time";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { Contributors } from "../domain/Contributors";
import type { ContributorId } from "../domain/ContributorId";
import {
  canShareTodoList,
  isContributor,
  grantAccess,
} from "../domain/TodoListPermission";
import { TodoListShared } from "../domain/TodoListShared";

export class GrantAccess {
  constructor(
    private readonly todoListPermissions: TodoListPermissions,
    private readonly contributors: Contributors,
    private readonly clock: Clock,
    private readonly events: Events
  ) {}

  async execute(
    todoListId: TodoListId,
    contributorId: ContributorId,
    newContributorEmail: string
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canShareTodoList(permission, contributorId);

    const contributorToGrantAccess = await this.contributors.ofEmail(
      newContributorEmail
    );

    if (!isContributor(permission, contributorToGrantAccess.id)) {
      await this.todoListPermissions.save(
        grantAccess(permission, contributorToGrantAccess.id)
      );

      this.events.publish(
        new TodoListShared(
          todoListId,
          contributorId,
          contributorToGrantAccess.id,
          this.clock.now()
        )
      );
    }
  }
}
