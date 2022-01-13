import type { Todo } from "~/domain/Todo";

interface TodoBuilder {
  todo: Todo;
  identifiedBy(id: string): TodoBuilder;
  build(): Todo;
}

export const anUncompletedTodo = (): TodoBuilder => ({
  todo: {
    id: "todo/1",
    todoListId: "todoList/1",
    isComplete: false,
    title: "Buy beer",
    createdAt: "2022-01-13T18:00:00.000Z",
  },
  identifiedBy(id: string): TodoBuilder {
    this.todo.id = id;
    return this;
  },
  build(): Todo {
    return this.todo;
  },
});
