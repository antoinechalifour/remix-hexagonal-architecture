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
    return Promise.resolve(undefined as any);
  }

  async save(todoListPermission: TodoListPermission): Promise<void> {
    return Promise.resolve(undefined);
  }
}
