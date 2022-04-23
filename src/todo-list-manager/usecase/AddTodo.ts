import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { GenerateId } from "../domain/GenerateId";
import type { Clock } from "../domain/Clock";

import { addTodo, TodoListId } from "../domain/TodoList";

export class AddTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoLists: TodoLists,
    private readonly generateId: GenerateId,
    private readonly clock: Clock
  ) {}

  async execute(todoListId: TodoListId, title: string) {
    const todoList = await this.todoLists.ofId(todoListId);
    const todo = addTodo(todoList, title, this.generateId, this.clock);

    await this.todos.save(todo);
  }
}
