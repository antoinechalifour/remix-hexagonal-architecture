import { DynamicModule, Module } from "@nestjs/common";
import { SessionIdStorageStrategy } from "remix";
import { RemixController } from "./RemixController";
import { RemixNestBuildConfig } from "./RemixNestBuildConfig";
import { BUILD_CONFIG, SESSION_CONFIG } from "./keys";
import { SessionManager } from "./SessionManager";

interface RemixNestOptions {
  handlerModule: any;
  buildConfig: RemixNestBuildConfig;
}

@Module({
  controllers: [RemixController],
})
export class RemixModule {
  static forRoot({
    handlerModule,
    buildConfig,
  }: RemixNestOptions): DynamicModule {
    return {
      module: RemixModule,
      imports: [handlerModule],
      providers: [
        {
          provide: BUILD_CONFIG,
          useValue: buildConfig,
        },
      ],
    };
  }
}
