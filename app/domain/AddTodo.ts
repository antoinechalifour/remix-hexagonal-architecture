import type { Todos } from "./Todos";
import type { TodoLists } from "./TodoLists";

import { addTodo, TodoListId } from "./TodoList";

interface AddTodoOptions {
  todos: Todos;
  todoLists: TodoLists;
}

export class AddTodo {
  private readonly todos;
  private readonly todoLists;

  constructor({ todos, todoLists }: AddTodoOptions) {
    this.todos = todos;
    this.todoLists = todoLists;
  }

  async execute(todoListId: TodoListId, title: string) {
    const todoList = await this.todoLists.ofId(todoListId);
    await this.todos.save(addTodo(todoList, title));
  }
}
