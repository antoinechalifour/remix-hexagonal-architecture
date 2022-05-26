import path from "path";
import { DynamicModule, Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ServeStaticModule } from "@nestjs/serve-static";
import { FakeMailer, MAILER, SendGridMailer } from "shared/mail";
import { GenerateUUID } from "shared/id";
import { NestEvents } from "shared/events";
import { RealClock } from "shared/time";
import { Prisma } from "shared/database";
import {
  AccountDatabaseRepository,
  AuthenticationApplicationService,
  BCryptPasswordHasher,
  FetchAuthenticationStatusDatabaseQuery,
} from "authentication";
import {
  FetchHomePageDatabaseQuery,
  FetchTodoListDatabaseQuery,
  TodoApplicationService,
  TodoDatabaseRepository,
  TodoListApplicationService,
  TodoListDatabaseRepository,
} from "todo-list-manager";
import {
  ACTIONS_CLASS,
  AUTHENTICATOR,
  LOADERS_CLASS,
  PRISMA,
  REMIX_HANDLER,
  SESSION_CONFIG,
} from "../keys";
import { TodoListEventsController } from "./controllers/TodoListEventsController";
import { TodoListEventsConsumer } from "./controllers/TodoListEventsConsumer";
import { AuthenticationEventsConsumer } from "../authentication/application/AuthenticationEventsConsumer";
import { RemixController } from "./remix/RemixController";
import { SessionAuthenticator } from "./authenticator/SessionAuthenticator";
import { Actions } from "./remix/Actions";
import { Loaders } from "./remix/Loaders";
import { SessionManager } from "./authenticator/SessionManager";
import { SessionIdStorageStrategy } from "remix";

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../../public"),
      serveStaticOptions: {
        immutable: true,
        maxAge: "1y",
      },
    }),
  ],
  controllers: [TodoListEventsController, RemixController],
  providers: [
    // Authentication
    AuthenticationApplicationService,
    AccountDatabaseRepository,
    FetchAuthenticationStatusDatabaseQuery,
    BCryptPasswordHasher,
    {
      provide: AUTHENTICATOR,
      useClass: SessionAuthenticator,
    },

    // TodoListManager
    TodoApplicationService,
    TodoListApplicationService,
    TodoDatabaseRepository,
    TodoListDatabaseRepository,
    FetchHomePageDatabaseQuery,
    FetchTodoListDatabaseQuery,

    // Remix stuff
    SessionManager,
    {
      provide: ACTIONS_CLASS,
      useClass: Actions,
    },
    {
      provide: LOADERS_CLASS,
      useClass: Loaders,
    },

    // Infrastructure
    GenerateUUID,
    NestEvents,
    RealClock,
    {
      provide: PRISMA,
      useClass: Prisma,
    },

    TodoListEventsConsumer,
    AuthenticationEventsConsumer,
  ],
})
export class ApplicationModule {
  static register({
    session,
    remixHandlerPath,
  }: {
    session: SessionIdStorageStrategy["cookie"];
    remixHandlerPath: string;
  }): DynamicModule {
    const MailerClass = process.env.SENDGRID_API_KEY
      ? SendGridMailer
      : FakeMailer;

    return {
      module: ApplicationModule,
      providers: [
        {
          provide: MAILER,
          useClass: MailerClass,
        },
        {
          provide: SESSION_CONFIG,
          useValue: session,
        },
        {
          provide: REMIX_HANDLER,
          useValue: remixHandlerPath,
        },
      ],
      imports: [],
    };
  }
}
