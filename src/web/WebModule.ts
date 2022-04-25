import { Module } from "@nestjs/common";
import { ACTIONS_CLASS, LOADERS_CLASS } from "remix-nest-adapter";
import { Actions } from "./Actions";
import { Loaders } from "./Loaders";
import { AuthenticationModule } from "authentication";
import { TodoListManagerModule } from "todo-list-manager";

@Module({
  imports: [AuthenticationModule, TodoListManagerModule],
  providers: [
    {
      provide: ACTIONS_CLASS,
      useClass: Actions,
    },
    {
      provide: LOADERS_CLASS,
      useClass: Loaders,
    },
  ],
  exports: [ACTIONS_CLASS, LOADERS_CLASS],
})
export class WebModule {}
