import { DynamicModule, Module } from "@nestjs/common";
import path from "path";
import { RemixModule } from "remix-nest-adapter";
import { CoreModule } from "./CoreModule";
import { TodoListEventsController } from "./controllers/TodoListEventsController";
import { TodoListEventsConsumer } from "./controllers/TodoListEventsConsumer";

const RemixBuildConfig = {
  publicBuildFolder: path.join(__dirname, "../../../public"),
  serverBuildFolder: path.join(__dirname, "../../../build"),
};

@Module({})
export class ApplicationModule {
  static registerAsync(): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [
        RemixModule.registerAsync({
          buildConfig: RemixBuildConfig,
          imports: [CoreModule],
          providers: [TodoListEventsConsumer],
          controllers: [TodoListEventsController],
          exports: [CoreModule],
        }),
      ],
    };
  }
}
