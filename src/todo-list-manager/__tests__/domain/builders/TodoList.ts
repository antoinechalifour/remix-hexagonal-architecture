import type { TodoList } from "../../../domain/TodoList";

interface TodoListBuilder {
  todoList: TodoList;
  withId(id: string): TodoListBuilder;
  ownedBy(ownerId: string): TodoListBuilder;
  build(): TodoList;
}

export const aTodoList = (): TodoListBuilder => ({
  todoList: {
    id: "6885f4fc-dc8e-46ef-bbbd-141de0db6c9c",
    ownerId: "f650d049-0b52-4fef-9798-9d9be18cab14",
    title: "A sample todo list",
    createdAt: new Date().toISOString(),
  },
  withId(id: string) {
    this.todoList.id = id;
    return this;
  },
  ownedBy(ownerId: string): TodoListBuilder {
    this.todoList.ownerId = ownerId;
    return this;
  },
  build() {
    return this.todoList;
  },
});
