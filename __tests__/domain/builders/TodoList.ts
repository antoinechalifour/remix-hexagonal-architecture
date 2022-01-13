import { TodoList } from "~/domain/TodoList";

interface TodoListBuilder {
  todoList: TodoList;

  identifiedBy(id: string): TodoListBuilder;

  build(): TodoList;
}

export const aTodoList = (): TodoListBuilder => ({
  todoList: {
    id: "todoList/1",
    title: "A sample todo list",
    createdAt: new Date().toISOString(),
  },
  identifiedBy(id: string) {
    this.todoList.id = id;
    return this;
  },
  build() {
    return this.todoList;
  },
});
