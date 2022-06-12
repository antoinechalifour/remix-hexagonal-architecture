import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { ContributorId } from "../domain/ContributorId";
import type { Todos } from "../domain/Todos";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import type { TodoListId } from "../domain/TodoList";
import { addTag, hasTag, TodoId } from "../domain/Todo";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TagAddedToTodo } from "../domain/event/TagAddedToTodo";
import { TodoListEvent } from "../domain/event/TodoListEvent";

export class AddTagToTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly clock: Clock,
    private readonly events: Events<TodoListEvent>
  ) {}

  async execute(
    todoListId: TodoListId,
    todoId: TodoId,
    contributorId: ContributorId,
    tag: string
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todo = await this.todos.ofId(todoId);
    if (hasTag(todo, tag)) return;

    await this.todos.save(addTag(todo, tag));
    await this.events.publish(
      new TagAddedToTodo(
        todoListId,
        contributorId,
        todoId,
        tag,
        this.clock.now()
      )
    );
  }
}
