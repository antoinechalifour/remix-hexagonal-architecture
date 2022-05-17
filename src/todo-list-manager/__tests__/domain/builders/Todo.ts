import type { Todo } from "../../../domain/Todo";

interface TodoBuilder {
  todo: Todo;
  withId(id: string): TodoBuilder;
  withTitle(title: string): TodoBuilder;
  ofTodoList(todoListId: string): TodoBuilder;
  ownedBy(ownerId: string): TodoBuilder;
  taggedAs(...tags: string[]): TodoBuilder;
  build(): Todo;
}

export const anUncompletedTodo = (): TodoBuilder => ({
  todo: {
    id: "475c8a3b-fce5-4042-afef-9c8b3c1418d7",
    todoListId: "ee576c05-8bd4-4997-ad59-535c86de3629",
    ownerId: "3af255b1-b988-4a7a-af57-c386be9625c5",
    isComplete: false,
    title: "Buy beer",
    createdAt: "2022-01-13T18:00:00.000Z",
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
  ownedBy(ownerId: string): TodoBuilder {
    this.todo.ownerId = ownerId;
    return this;
  },
  taggedAs(...tags): TodoBuilder {
    this.todo.tags = tags;
    return this;
  },
  build(): Todo {
    return this.todo;
  },
});

export const aTodo = (): TodoBuilder => ({
  todo: {
    id: "9d3dd87b-c570-4271-92eb-f4d6ca011ffa",
    createdAt: "2022-01-15T12:00:00.000Z",
    title: "Buy beers",
    todoListId: "3608ffe6-c397-416d-8b49-a17340c5fde4",
    ownerId: "ae178415-c990-4298-b7b9-3feb6eba5db3",
    isComplete: false,
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
  ownedBy(ownerId: string): TodoBuilder {
    this.todo.ownerId = ownerId;
    return this;
  },
  taggedAs(...tags): TodoBuilder {
    this.todo.tags = tags;
    return this;
  },
  build(): Todo {
    return this.todo;
  },
});
