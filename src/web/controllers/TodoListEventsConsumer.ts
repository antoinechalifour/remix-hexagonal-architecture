import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { OnEvent } from "@nestjs/event-emitter";
import { Event } from "shared/events";
import { TodoListUpdated } from "../../todo-list-manager/domain/TodoListUpdated";
import { TodoUpdated } from "../../todo-list-manager/domain/TodoUpdated";
import { TodoReordered } from "../../todo-list-manager/domain/TodoReordered";
import { TodoListShared } from "../../todo-list-manager/domain/TodoListShared";
import { TodoDeleted } from "../../todo-list-manager/domain/TodoDeleted";
import { TodoCompletionChanged } from "../../todo-list-manager/domain/TodoCompletionChanged";
import { TodoAdded } from "../../todo-list-manager/domain/TodoAdded";
import { TagAddedToTodo } from "../../todo-list-manager/domain/TagAddedToTodo";
import { TagRemovedFromTodo } from "../../todo-list-manager/domain/TagRemovedFromTodo";
import { AccessRevoked } from "../../todo-list-manager/domain/AccessRevoked";

@Injectable()
export class TodoListEventsConsumer {
  private subject = new Subject<Event & { todoListId: string }>();

  @OnEvent("todoList.*")
  handeTodoListEvents(event: TodoListUpdated | TodoListShared | AccessRevoked) {
    this.subject.next(event);
  }

  @OnEvent("todo.*")
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
