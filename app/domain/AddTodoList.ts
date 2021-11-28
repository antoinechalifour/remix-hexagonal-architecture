import type { TodoLists } from "./TodoLists";

import { makeTodoList } from "./TodoList";

interface AddTodoListOptions {
  todoLists: TodoLists;
}

export class AddTodoList {
  private readonly todoLists;

  constructor({ todoLists }: AddTodoListOptions) {
    this.todoLists = todoLists;
  }

  async execute(title: string) {
    const todoList = makeTodoList(title);
    await this.todoLists.save(todoList);

    return `/l/${todoList.id}`;
  }
}
