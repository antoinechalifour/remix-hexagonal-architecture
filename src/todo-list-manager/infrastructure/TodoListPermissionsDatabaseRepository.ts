import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListId } from "../domain/TodoList";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoListPermission } from "../domain/TodoListPermission";
import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";
import { TodoListNotFoundError } from "../domain/TodoListNotFoundError";

@Injectable()
export class TodoListPermissionsDatabaseRepository
  extends PrismaRepository
  implements TodoListPermissions
{
  async ofTodoList(todoListId: TodoListId): Promise<TodoListPermission> {
    const row = await this.prisma.todoListPermission.findFirst({
      where: { todoListId },
    });

    if (row == null) throw new TodoListNotFoundError(todoListId);

    return {
      todoListId: row.todoListId,
      ownerId: row.ownerId,
      contributorsIds: row.contributorsIds as string[],
    };
  }

  async ofContributor(
    contributorId: ContributorId
  ): Promise<TodoListPermission[]> {
    const rows = await this.prisma.todoListPermission.findMany({
      where: {
        OR: [
          { ownerId: contributorId },
          {
            contributorsIds: {
              array_contains: [contributorId],
            },
          },
        ],
      },
    });

    return rows.map((row) => ({
      todoListId: row.todoListId,
      ownerId: row.ownerId,
      contributorsIds: row.contributorsIds as string[],
    }));
  }

  async save(todoListPermission: TodoListPermission): Promise<void> {
    await this.prisma.todoListPermission.upsert({
      where: { todoListId: todoListPermission.todoListId },
      create: {
        todoListId: todoListPermission.todoListId,
        ownerId: todoListPermission.ownerId,
        contributorsIds: todoListPermission.contributorsIds,
      },
      update: { contributorsIds: todoListPermission.contributorsIds },
    });
  }

  async remove(todoListPermission: TodoListPermission): Promise<void> {
    await this.prisma.todoListPermission.delete({
      where: { todoListId: todoListPermission.todoListId },
    });
  }
}
