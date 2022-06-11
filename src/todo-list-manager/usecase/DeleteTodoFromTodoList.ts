import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoId } from "../domain/Todo";
import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { removeTodoFromOrder } from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoDeleted } from "../domain/TodoDeleted";
import { TodoListEvent } from "../domain/TodoListEvent";

export class DeleteTodoFromTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todos: Todos,
    private readonly clock: Clock,
    private readonly events: Events<TodoListEvent>
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    contributorId: ContributorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const [todoList, todo] = await Promise.all([
      this.todoLists.ofId(todoListId),
      this.todos.ofId(todoId),
    ]);

    await Promise.all([
      this.todoLists.save(removeTodoFromOrder(todoList, todoId)),
      this.todos.remove(todoId),
    ]);

    await this.events.publish(
      new TodoDeleted(
        todoListId,
        contributorId,
        todo.id,
        todo.title,
        this.clock.now()
      )
    );
  }
}
