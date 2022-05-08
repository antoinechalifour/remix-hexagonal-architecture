import type { Todos } from "../domain/Todos";
import type { TodoId } from "../domain/Todo";
import { updateCompletion } from "../domain/Todo";
import type { OwnerId } from "../domain/OwnerId";
import { TodoLists } from "../domain/TodoLists";
import {
  orderAsFirstTodo,
  orderAsLastTodo,
  reorderTodoList,
} from "../domain/TodoList";

export class ChangeTodoCompletion {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todos: Todos
  ) {}

  async execute(
    todoListId: string,
    todoId: TodoId,
    isChecked: string,
    ownerId: OwnerId
  ) {
    const completed = isChecked === "on";
    const todo = await this.todos.ofId(todoId, ownerId);
    const todoList = await this.todoLists.ofId(todoListId, ownerId);

    const newTodoOrder = completed
      ? orderAsLastTodo(todoList.todosOrder)
      : orderAsFirstTodo();

    await this.todos.save(updateCompletion(todo, completed));
    await this.todoLists.save(reorderTodoList(todoList, todoId, newTodoOrder));
  }
}
