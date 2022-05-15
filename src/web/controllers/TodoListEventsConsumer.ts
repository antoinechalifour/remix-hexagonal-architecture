import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { TodoListUpdated } from "../../todo-list-manager/domain/TodoListUpdated";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class TodoListEventsConsumer {
  private subject = new Subject<TodoListUpdated>();

  @OnEvent(TodoListUpdated.TYPE)
  subscribe(event: TodoListUpdated) {
    this.subject.next(event);
  }

  get events() {
    return this.subject.asObservable();
  }
}
