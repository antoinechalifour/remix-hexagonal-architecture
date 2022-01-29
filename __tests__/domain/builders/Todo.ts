import type { Todo } from "~/domain/Todo";

interface TodoBuilder {
  todo: Todo;
  identifiedBy(id: string): TodoBuilder;
  ofTodoList(todoListId: string): TodoBuilder;
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
  ofTodoList(todoListId: string): TodoBuilder {
    this.todo.todoListId = todoListId;
    return this;
  },
  build(): Todo {
    return this.todo;
  },
});

export const aTodo = (): TodoBuilder => ({
  todo: {
    id: "todos/1",
    createdAt: "2022-01-15T12:00:00.000Z",
    title: "Buy beers",
    todoListId: "todoLists/1",
    isComplete: false,
  },
  identifiedBy(id: string): TodoBuilder {
    this.todo.id = id;
    return this;
  },
  ofTodoList(todoListId: string): TodoBuilder {
    this.todo.todoListId = todoListId;
    return this;
  },
  build(): Todo {
    return this.todo;
  },
});
