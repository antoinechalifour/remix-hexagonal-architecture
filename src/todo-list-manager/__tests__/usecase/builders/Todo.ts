import type { Todo } from "../../../domain/Todo";

export interface TodoBuilder {
  todo: Todo;
  withId(id: string): TodoBuilder;
  withTitle(title: string): TodoBuilder;
  ofTodoList(todoListId: string): TodoBuilder;
  taggedAs(...tags: string[]): TodoBuilder;
  completed({ at }: { at: Date }): TodoBuilder;
  uncompleted(): TodoBuilder;
  build(): Todo;
}

export const aTodo = (): TodoBuilder => ({
  todo: {
    id: "9d3dd87b-c570-4271-92eb-f4d6ca011ffa",
    createdAt: new Date("2022-01-15T12:00:00.000Z"),
    title: "Buy beers",
    todoListId: "3608ffe6-c397-416d-8b49-a17340c5fde4",
    isDone: false,
    doneAt: null,
    tags: [],
  },
  withId(id: string): TodoBuilder {
    this.todo.id = id;
    return this;
  },
  ofTodoList(todoListId: string): TodoBuilder {
    this.todo.todoListId = todoListId;
    return this;
  },
  withTitle(title: string): TodoBuilder {
    this.todo.title = title;
    return this;
  },
  taggedAs(...tags): TodoBuilder {
    this.todo.tags = tags;
    return this;
  },
  completed({ at }): TodoBuilder {
    this.todo.isDone = true;
    this.todo.doneAt = at;
    return this;
  },
  uncompleted(): TodoBuilder {
    this.todo.isDone = false;
    return this;
  },
  build(): Todo {
    return this.todo;
  },
});
