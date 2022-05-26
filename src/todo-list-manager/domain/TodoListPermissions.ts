import { TodoListPermission } from "./TodoListPermission";
import { TodoListId } from "./TodoList";

export interface TodoListPermissions {
  ofTodoList(todoListId: TodoListId): Promise<TodoListPermission>;
  save(todoListPermission: TodoListPermission): Promise<void>;
}
