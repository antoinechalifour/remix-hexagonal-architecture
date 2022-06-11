import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { Todos } from "../domain/Todos";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { ContributorId } from "../domain/ContributorId";
import type { TodoListId } from "../domain/TodoList";
import { updateTitle, TodoId } from "../domain/Todo";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoUpdated } from "../domain/TodoUpdated";
import { TodoListEvent } from "../domain/TodoListEvent";

export class UpdateTodoTitle {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly clock: Clock,
    private readonly events: Events<TodoListEvent>
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    title: string,
    contributorId: ContributorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todo = await this.todos.ofId(todoId);
    const previousTitle = todo.title;
    await this.todos.save(updateTitle(todo, title));
    this.events.publish(
      new TodoUpdated(
        todoListId,
        contributorId,
        todoId,
        {
          title: { previous: previousTitle, current: title },
        },
        this.clock.now()
      )
    );
  }
}
