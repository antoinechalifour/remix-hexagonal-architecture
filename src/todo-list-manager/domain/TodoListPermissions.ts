import { TodoListPermission } from "./TodoListPermission";
import { TodoListId } from "./TodoList";
import { CollaboratorId } from "./CollaboratorId";

export interface TodoListPermissions {
  ofTodoList(todoListId: TodoListId): Promise<TodoListPermission>;
  ofCollaborator(collaboratorId: CollaboratorId): Promise<TodoListPermission[]>;
  save(todoListPermission: TodoListPermission): Promise<void>;
  remove(todoListPermission: TodoListPermission): Promise<void>;
}
