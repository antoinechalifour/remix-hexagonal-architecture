import type { CollaboratorId } from "../domain/CollaboratorId";
import type { Todos } from "../domain/Todos";
import type { TodoId } from "../domain/Todo";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { updateCompletion } from "../domain/Todo";
import { TodoLists } from "../domain/TodoLists";
import {
  orderAsFirstTodo,
  orderAsLastTodo,
  reorderTodoList,
} from "../domain/TodoList";
import { canChangeTodoCompletion } from "../domain/TodoListPermission";

export class ChangeTodoCompletion {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todos: Todos
  ) {}

  async execute(
    todoListId: string,
    todoId: TodoId,
    isChecked: string,
    collaboratorId: CollaboratorId
  ) {
    const completed = isChecked === "on";
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canChangeTodoCompletion(permission, collaboratorId);

    const [todo, todoList] = await Promise.all([
      this.todos.ofId(todoId, collaboratorId),
      this.todoLists.ofId(todoListId, collaboratorId),
    ]);

    const newTodoOrder = completed
      ? orderAsLastTodo(todoList.todosOrder)
      : orderAsFirstTodo();

    await Promise.all([
      this.todos.save(updateCompletion(todo, completed)),
      this.todoLists.save(reorderTodoList(todoList, todoId, newTodoOrder)),
    ]);
  }
}
