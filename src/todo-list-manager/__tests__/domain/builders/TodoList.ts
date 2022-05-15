import type { TodoList } from "../../../domain/TodoList";
import { TodoId } from "../../../domain/Todo";

interface TodoListBuilder {
  todoList: TodoList;
  withId(id: string): TodoListBuilder;
  ownedBy(ownerId: string): TodoListBuilder;
  withTitle(title: string): TodoListBuilder;
  withTodosOrder(...todoIds: TodoId[]): TodoListBuilder;
  build(): TodoList;
}

export const aTodoList = (): TodoListBuilder => ({
  todoList: {
    id: "6885f4fc-dc8e-46ef-bbbd-141de0db6c9c",
    ownerId: "f650d049-0b52-4fef-9798-9d9be18cab14",
    title: "A sample todo list",
    createdAt: new Date().toISOString(),
    todosOrder: [],
  },
  withId(id: string) {
    this.todoList.id = id;
    return this;
  },
  ownedBy(ownerId: string): TodoListBuilder {
    this.todoList.ownerId = ownerId;
    return this;
  },
  withTitle(title: string): TodoListBuilder {
    this.todoList.title = title;
    return this;
  },
  withTodosOrder(...todoIds: TodoId[]): TodoListBuilder {
    this.todoList.todosOrder = todoIds;
    return this;
  },
  build() {
    return this.todoList;
  },
});
