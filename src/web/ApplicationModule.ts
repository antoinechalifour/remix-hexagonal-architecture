import path from "path";
import { SessionIdStorageStrategy } from "@remix-run/node";
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
  AuthenticationEventsConsumer,
  BCryptPasswordHasher,
  FetchAuthenticationStatusSessionQuery,
} from "authentication";
import {
  ContributorsAdapter,
  TodoListDatabaseQuery,
  TodoApplicationService,
  TodoDatabaseRepository,
  TodoListPermissionsDatabaseRepository,
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
import { SessionAuthenticator } from "./authenticator/SessionAuthenticator";
import { SessionManager } from "./authenticator/SessionManager";
import { TodoListEventsController } from "./controllers/TodoListEventsController";
import { TodoListEventsConsumer } from "./controllers/TodoListEventsConsumer";
import { RemixController } from "./remix/RemixController";
import { Actions } from "./remix/Actions";
import { Loaders } from "./remix/Loaders";

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
    FetchAuthenticationStatusSessionQuery,
    BCryptPasswordHasher,
    {
      provide: AUTHENTICATOR,
      useClass: SessionAuthenticator,
    },

    // TodoListManager
    ContributorsAdapter,
    TodoApplicationService,
    TodoListApplicationService,
    TodoDatabaseRepository,
    TodoListDatabaseRepository,
    TodoListPermissionsDatabaseRepository,
    TodoListDatabaseQuery,

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
