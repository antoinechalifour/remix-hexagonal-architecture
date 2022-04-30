import { Module } from "@nestjs/common";
import {
  ACTIONS_CLASS,
  LOADERS_CLASS,
  SESSION_CONFIG,
  SessionManager,
} from "remix-nest-adapter";
import { Actions } from "./Actions";
import { Loaders } from "./Loaders";
import { AuthenticationModule } from "authentication";
import { TodoListManagerModule } from "todo-list-manager";
import { Authenticator } from "./Authenticator";

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
    {
      provide: SESSION_CONFIG,
      useValue: {
        name: "__session",
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "strict",
        secrets: ["azerty"],
      },
    },
    SessionManager,
    Authenticator,
  ],
  exports: [ACTIONS_CLASS, LOADERS_CLASS],
})
export class WebModule {}
