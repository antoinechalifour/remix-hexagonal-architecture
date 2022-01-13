import type { Todos } from "./Todos";
import type { TodoLists } from "./TodoLists";
import type { GenerateId } from "~/domain/GenerateId";
import type { Clock } from "~/domain/Clock";

import { addTodo, TodoListId } from "./TodoList";

interface AddTodoOptions {
  todos: Todos;
  todoLists: TodoLists;
  generateId: GenerateId;
  clock: Clock;
}

export class AddTodo {
  private readonly todos;
  private readonly todoLists;
  private readonly generateId;
  private readonly clock;

  constructor({ todos, todoLists, generateId, clock }: AddTodoOptions) {
    this.todos = todos;
    this.todoLists = todoLists;
    this.generateId = generateId;
    this.clock = clock;
  }

  async execute(todoListId: TodoListId, title: string) {
    const todoList = await this.todoLists.ofId(todoListId);
    const todo = addTodo(todoList, title, this.generateId, this.clock);

    await this.todos.save(todo);
  }
}
