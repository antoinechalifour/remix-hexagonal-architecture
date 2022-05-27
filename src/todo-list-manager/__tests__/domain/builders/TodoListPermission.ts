import type { TodoListPermission } from "../../../domain/TodoListPermission";
import type { TodoListId } from "../../../domain/TodoList";
import type { OwnerId } from "../../../domain/OwnerId";

interface TodoListPermissionBuilder {
  todoListPermission: TodoListPermission;
  forTodoList(todoListId: TodoListId): TodoListPermissionBuilder;
  forOwner(ownerId: OwnerId): TodoListPermissionBuilder;
  build(): TodoListPermission;
}

export const aTodoListPermission = (): TodoListPermissionBuilder => ({
  todoListPermission: {
    todoListId: "todoList/1",
    ownerId: "owner/1",
    collaboratorsIds: [],
  },
  forTodoList(todoListId: TodoListId): TodoListPermissionBuilder {
    this.todoListPermission.todoListId = todoListId;
    return this;
  },
  forOwner(ownerId: OwnerId): TodoListPermissionBuilder {
    this.todoListPermission.ownerId = ownerId;
    return this;
  },
  build(): TodoListPermission {
    return this.todoListPermission;
  },
});
