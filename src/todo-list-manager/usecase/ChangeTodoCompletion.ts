import type { Clock } from "shared/time";
import type { CollaboratorId } from "../domain/CollaboratorId";
import type { Todos } from "../domain/Todos";
import type { TodoId } from "../domain/Todo";
import { updateCompletion } from "../domain/Todo";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { TodoLists } from "../domain/TodoLists";
import {
  orderAsFirstTodo,
  orderAsLastTodo,
  reorderTodoList,
} from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";

export class ChangeTodoCompletion {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todos: Todos,
    private readonly clock: Clock
  ) {}

  async execute(
    todoListId: string,
    todoId: TodoId,
    isChecked: string,
    collaboratorId: CollaboratorId
  ) {
    const completed = isChecked === "on";
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, collaboratorId);

    const [todo, todoList] = await Promise.all([
      this.todos.ofId(todoId),
      this.todoLists.ofId(todoListId),
    ]);

    const newTodoOrder = completed
      ? orderAsLastTodo(todoList.todosOrder)
      : orderAsFirstTodo();

    await Promise.all([
      this.todos.save(updateCompletion(todo, completed, this.clock)),
      this.todoLists.save(reorderTodoList(todoList, todoId, newTodoOrder)),
    ]);
  }
}
