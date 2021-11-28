import type { TodoListId } from "./TodoList";
import type { Todo, TodoId } from "./Todo";

export interface Todos {
  ofId(todoId: TodoId): Promise<Todo>;
  ofTodoList(todoListId: TodoListId): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  remove(todoId: string): Promise<void>;
}
