import { TodoListPermission } from "./TodoListPermission";
import { TodoListId } from "./TodoList";
import { ContributorId } from "./ContributorId";

export interface TodoListPermissions {
  ofTodoList(todoListId: TodoListId): Promise<TodoListPermission>;
  ofContributor(contributorId: ContributorId): Promise<TodoListPermission[]>;
  save(todoListPermission: TodoListPermission): Promise<void>;
  remove(todoListPermission: TodoListPermission): Promise<void>;
}
