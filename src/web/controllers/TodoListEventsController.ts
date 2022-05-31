import { Controller, Sse, Param, Inject } from "@nestjs/common";
import { filter, interval, map, merge } from "rxjs";
import { Authenticator } from "authentication";
import { AUTHENTICATOR } from "../../keys";
import { TodoListEventsConsumer } from "./TodoListEventsConsumer";

@Controller("events/l")
export class TodoListEventsController {
  constructor(
    @Inject(AUTHENTICATOR)
    private readonly authenticator: Authenticator,
    private readonly todoListEvents: TodoListEventsConsumer
  ) {}

  @Sse("/:todoListId")
  async getEvents(@Param("todoListId") todoListId: string) {
    const currentUser = await this.authenticator.currentUser();
    const heartbeat$ = interval(30_000).pipe(
      map(() => ({ type: "heartbeat", data: "_" }))
    );

    const updates$ = this.todoListEvents.events.pipe(
      filter(
        (event) =>
          event.todoListId === todoListId &&
          event.sessionId !== currentUser.sessionId
      ),
      map((event) => ({ type: "update", data: event.type } as MessageEvent))
    );

    return merge(heartbeat$, updates$);
  }
}
