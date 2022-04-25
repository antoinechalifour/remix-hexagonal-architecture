import { DynamicModule, Module } from "@nestjs/common";
import { RemixController } from "./RemixController";
import { RemixNestBuildConfig } from "./RemixNestBuildConfig";
import { BUILD_CONFIG } from "./keys";

interface RemixNestOptions {
  buildConfig: RemixNestBuildConfig;
  handlerModule: any;
}

@Module({
  controllers: [RemixController],
})
export class RemixModule {
  static forRoot({
    buildConfig,
    handlerModule,
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
