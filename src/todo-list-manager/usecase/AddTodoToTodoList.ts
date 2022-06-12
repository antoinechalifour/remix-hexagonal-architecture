import type { Clock } from "shared/time";
import type { Events } from "shared/events";
import type { ContributorId } from "../domain/ContributorId";
import type { GenerateId } from "shared/id";
import type { Todos } from "../domain/Todos";
import type { TodoLists } from "../domain/TodoLists";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { addTodo, TodoListId } from "../domain/TodoList";
import { canEditTodoList } from "../domain/TodoListPermission";
import { TodoAdded } from "../domain/event/TodoAdded";
import { TodoListEvent } from "../domain/event/TodoListEvent";

export class AddTodoToTodoList {
  constructor(
    private readonly todos: Todos,
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly generateId: GenerateId,
    private readonly clock: Clock,
    private readonly events: Events<TodoListEvent>
  ) {}

  async execute(
    todoListId: TodoListId,
    title: string,
    contributorId: ContributorId
  ) {
    const permission = await this.todoListPermissions.ofTodoList(todoListId);
    canEditTodoList(permission, contributorId);

    const todoList = await this.todoLists.ofId(todoListId);
    const [updatedTodoList, addedTodo] = addTodo(
      todoList,
      title,
      this.generateId,
      this.clock
    );

    await Promise.all([
      this.todoLists.save(updatedTodoList),
      this.todos.save(addedTodo),
    ]);

    await this.events.publish(
      new TodoAdded(todoListId, contributorId, addedTodo.id, this.clock.now())
    );
  }
}
