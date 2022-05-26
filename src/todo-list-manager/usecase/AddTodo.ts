import type { Clock } from "shared/time";
import type { CollaboratorId } from "../domain/CollaboratorId";
import type { GenerateId } from "shared/id";
import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListPermissions } from "../domain/TodoListPermissions";

import { addTodo, TodoListId } from "../domain/TodoList";
import { canAddTodo } from "../domain/TodoListPermission";

export class AddTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly generateId: GenerateId,
    private readonly clock: Clock
  ) {}

  async execute(
    todoListId: TodoListId,
    title: string,
    collaboratorId: CollaboratorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canAddTodo(permission, collaboratorId);

    const todoList = await this.todoLists.ofId(todoListId, collaboratorId);
    const [updatedTodoList, createdTodo] = addTodo(
      todoList,
      title,
      this.generateId,
      this.clock
    );

    await Promise.all([
      this.todoLists.save(updatedTodoList),
      this.todos.save(createdTodo),
    ]);
  }
}
