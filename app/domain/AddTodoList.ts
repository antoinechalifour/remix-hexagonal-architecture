import type { TodoLists } from "./TodoLists";
import type { GenerateId } from "~/domain/GenerateId";
import type { Clock } from "~/domain/Clock";

import { makeTodoList } from "./TodoList";

interface AddTodoListOptions {
  todoLists: TodoLists;
  generateId: GenerateId;
  clock: Clock;
}

export class AddTodoList {
  private readonly todoLists;
  private readonly generateId;
  private readonly clock;

  constructor({ todoLists, generateId, clock }: AddTodoListOptions) {
    this.todoLists = todoLists;
    this.generateId = generateId;
    this.clock = clock;
  }

  async execute(title: string) {
    const todoList = makeTodoList(title, this.generateId, this.clock);
    await this.todoLists.save(todoList);

    return `/l/${todoList.id}`;
  }
}
