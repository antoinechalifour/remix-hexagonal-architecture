import type { Clock } from "shared/time";
import type { GenerateId } from "shared/id";
import type { Events } from "shared/events";
import type { TodoLists } from "../domain/TodoLists";
import type { OwnerId } from "../domain/OwnerId";
import type { TodoListPermissions } from "../domain/TodoListPermissions";
import { createTotoList } from "../domain/TodoList";
import { createPermissions } from "../domain/TodoListPermission";
import { TodoListCreated } from "../domain/event/TodoListCreated";
import { TodoListEvent } from "../domain/event/TodoListEvent";

export class CreateTodoList {
  constructor(
    private readonly todoLists: TodoLists,
    private readonly todoListPermissions: TodoListPermissions,
    private readonly generateId: GenerateId,
    private readonly clock: Clock,
    private readonly events: Events<TodoListEvent>
  ) {}

  async execute(title: string, ownerId: OwnerId) {
    const todoList = createTotoList(title, this.generateId, this.clock);
    const todoListPermissions = createPermissions(todoList, ownerId);

    await this.todoLists.save(todoList);
    await this.todoListPermissions.save(todoListPermissions);
    await this.events.publish(
      new TodoListCreated(todoList.id, ownerId, this.clock.now())
    );

    return todoList.id;
  }
}
