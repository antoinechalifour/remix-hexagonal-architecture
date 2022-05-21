import type { Clock } from "shared/time";
import type { GenerateId } from "shared/id";
import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { OwnerId } from "../domain/OwnerId";

import { addTodo, TodoListId } from "../domain/TodoList";

export class AddTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoLists: TodoLists,
    private readonly generateId: GenerateId,
    private readonly clock: Clock
  ) {}

  async execute(todoListId: TodoListId, title: string, ownerId: OwnerId) {
    const todoList = await this.todoLists.ofId(todoListId, ownerId);
    const [updatedTodoList, createdTodo] = addTodo(
      todoList,
      title,
      this.generateId,
      this.clock
    );

    await Promise.all([
      this.todoLists.save(updatedTodoList),
      this.todos.save(createdTodo),
    ]);
  }
}
