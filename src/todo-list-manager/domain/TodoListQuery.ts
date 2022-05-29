import type { TodoListDto } from "shared/client";
import type { TodoListId } from "./TodoList";

export interface TodoListQuery {
  ofTodoList(todoListId: TodoListId): Promise<TodoListDto>;
}
