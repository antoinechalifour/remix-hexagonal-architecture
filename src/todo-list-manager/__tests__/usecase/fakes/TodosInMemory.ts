import type { Todos } from "../../../domain/Todos";
import type { Todo, TodoId } from "../../../domain/Todo";
import type { TodoListId } from "../../../domain/TodoList";

export class TodosInMemory implements Todos {
  private __database = new Map<string, Todo>();

  ofId(todoId: TodoId): Promise<Todo> {
    const todo = this.__database.get(todoId);

    if (!todo) throw new Error(`Todo ${todoId} not found`);

    return Promise.resolve(todo);
  }

  ofTodoList(todoListId: TodoListId): Promise<Todo[]> {
    const todos = [...this.__database.values()].filter(
      (todo) => todo.todoListId === todoListId
    );

    return Promise.resolve(todos);
  }

  remove(todoId: string): Promise<void> {
    this.__database.delete(todoId);

    return Promise.resolve();
  }

  save(todo: Todo): Promise<void> {
    this.__database.set(todo.id, todo);

    return Promise.resolve();
  }
}
