import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { OnEvent } from "@nestjs/event-emitter";
import { Event } from "shared/events";
import { TodoListUpdated } from "../../todo-list-manager/domain/event/TodoListUpdated";
import { TodoUpdated } from "../../todo-list-manager/domain/event/TodoUpdated";
import { TodoReordered } from "../../todo-list-manager/domain/event/TodoReordered";
import { TodoListAccessGranted } from "../../todo-list-manager/domain/event/TodoListAccessGranted";
import { TodoDeleted } from "../../todo-list-manager/domain/event/TodoDeleted";
import { TodoCompletionChanged } from "../../todo-list-manager/domain/event/TodoCompletionChanged";
import { TodoAdded } from "../../todo-list-manager/domain/event/TodoAdded";
import { TagAddedToTodo } from "../../todo-list-manager/domain/event/TagAddedToTodo";
import { TagRemovedFromTodo } from "../../todo-list-manager/domain/event/TagRemovedFromTodo";
import { TodoListAccessRevoked } from "../../todo-list-manager/domain/event/TodoListAccessRevoked";

@Injectable()
export class TodoListEventsConsumer {
  private subject = new Subject<Event & { todoListId: string }>();

  @OnEvent("todoList.*", { async: true })
  handeTodoListEvents(
    event: TodoListUpdated | TodoListAccessGranted | TodoListAccessRevoked
  ) {
    this.subject.next(event);
  }

  @OnEvent("todo.*", { async: true })
  handleTodoEvents(
    event:
      | TodoUpdated
      | TodoReordered
      | TodoAdded
      | TodoCompletionChanged
      | TodoDeleted
      | TagAddedToTodo
      | TagRemovedFromTodo
  ) {
    this.subject.next(event);
  }

  get events() {
    return this.subject.asObservable();
  }
}
