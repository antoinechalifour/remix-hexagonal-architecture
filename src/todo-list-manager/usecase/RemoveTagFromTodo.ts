import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { ContributorId } from "../domain/ContributorId";
import type { Todos } from "../domain/Todos";
import type { TodoListId } from "../domain/TodoList";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { TodoId, removeTag, hasTag } from "../domain/Todo";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TagRemovedFromTodo } from "../domain/TagRemovedFromTodo";

export class RemoveTagFromTodo {
  constructor(
    private readonly todos: Todos,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly clock: Clock,
    private readonly events: Events
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
    if (!hasTag(todo, tag)) return;

    await this.todos.save(removeTag(todo, tag));
    this.events.publish(
      new TagRemovedFromTodo(
        todoListId,
        contributorId,
        todoId,
        tag,
        this.clock.now()
      )
    );
  }
}
