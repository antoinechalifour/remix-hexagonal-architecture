import { Controller, Sse, Param } from "@nestjs/common";
import { filter, interval, map, merge } from "rxjs";
import { TodoListEventsConsumer } from "./TodoListEventsConsumer";

@Controller("events/l")
export class TodoListEventsController {
  constructor(private readonly todoListEvents: TodoListEventsConsumer) {}

  @Sse("/:todoListId")
  async getEvents(@Param("todoListId") todoListId: string) {
    const heartbeat$ = interval(30_000).pipe(
      map(() => ({ type: "heartbeat", data: "_" }))
    );

    const updates$ = this.todoListEvents.events.pipe(
      filter((event) => event.todoListId === todoListId),
      map((event) => ({ type: "update", data: event.type } as MessageEvent))
    );

    return merge(heartbeat$, updates$);
  }
}
