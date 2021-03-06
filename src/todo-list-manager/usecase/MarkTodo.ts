import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { ContributorId } from "../domain/ContributorId";
import type { Todos } from "../domain/Todos";
import type { Todo, TodoId } from "../domain/Todo";
import { markAsDoing, markAsDone } from "../domain/Todo";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { TodoLists } from "../domain/TodoLists";
import {
  insertTodoToFirstPlace,
  removeTodoFromOrder,
  TodoList,
} from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoCompletionChanged } from "../domain/event/TodoCompletionChanged";
import { TodoListEvent } from "../domain/event/TodoListEvent";

export class MarkTodo {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly todos: Todos,
    private readonly clock: Clock,
    private readonly events: Events<TodoListEvent>
  ) {}

  async execute(
    todoListId: string,
    todoId: TodoId,
    isDone: boolean,
    contributorId: ContributorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const [todo, todoList] = await Promise.all([
      this.todos.ofId(todoId),
      this.todoLists.ofId(todoListId),
    ]);

    await Promise.all([
      this.todos.save(this.markTodo(todo, isDone)),
      this.todoLists.save(this.reorderTodoList(todoList, todoId, isDone)),
    ]);

    await this.events.publish(
      new TodoCompletionChanged(
        todoListId,
        contributorId,
        todoId,
        this.getCompletion(isDone),
        this.clock.now()
      )
    );
  }

  private getCompletion(isDone: boolean) {
    return isDone ? "done" : "doing";
  }

  private reorderTodoList(todoList: TodoList, todoId: TodoId, isDone: boolean) {
    return isDone
      ? removeTodoFromOrder(todoList, todoId)
      : insertTodoToFirstPlace(todoList, todoId);
  }

  private markTodo(todo: Todo, isDone: boolean) {
    return isDone ? markAsDone(todo, this.clock) : markAsDoing(todo);
  }
}
