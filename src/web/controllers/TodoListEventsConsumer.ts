import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { OnEvent } from "@nestjs/event-emitter";
import { Event } from "shared/events";
import { TodoListUpdated } from "../../todo-list-manager/domain/TodoListUpdated";
import { TodoUpdated } from "../../todo-list-manager/domain/TodoUpdated";
import { TodoReordered } from "../../todo-list-manager/domain/TodoReordered";
import { TodoListAccessGranted } from "../../todo-list-manager/domain/TodoListAccessGranted";
import { TodoDeleted } from "../../todo-list-manager/domain/TodoDeleted";
import { TodoCompletionChanged } from "../../todo-list-manager/domain/TodoCompletionChanged";
import { TodoAdded } from "../../todo-list-manager/domain/TodoAdded";
import { TagAddedToTodo } from "../../todo-list-manager/domain/TagAddedToTodo";
import { TagRemovedFromTodo } from "../../todo-list-manager/domain/TagRemovedFromTodo";
import { TodoListAccessRevoked } from "../../todo-list-manager/domain/TodoListAccessRevoked";

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
