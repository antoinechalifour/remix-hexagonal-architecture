import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermission } from "../domain/TodoListPermission";
import { Injectable } from "@nestjs/common";
import { PrismaRepository } from "shared/database";

@Injectable()
export class TodoListPermissionsDatabaseRepository
  extends PrismaRepository
  implements TodoListPermissions
{
  async ofTodoList(todoListId: TodoListId): Promise<TodoListPermission> {
    const row = await this.prisma.todoListPermission.findFirst({
      where: { todoListId },
      rejectOnNotFound: true,
    });

    return {
      todoListId: row.todoListId,
      ownerId: row.ownerId,
    };
  }

  async save(todoListPermission: TodoListPermission): Promise<void> {
    await this.prisma.todoListPermission.upsert({
      where: { todoListId: todoListPermission.todoListId },
      create: {
        todoListId: todoListPermission.todoListId,
        ownerId: todoListPermission.ownerId,
      },
      update: { ownerId: todoListPermission.ownerId },
    });
  }

  async remove(todoListPermission: TodoListPermission): Promise<void> {
    await this.prisma.todoListPermission.delete({
      where: { todoListId: todoListPermission.todoListId },
    });
  }
}
