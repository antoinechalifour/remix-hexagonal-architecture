import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";
import { RemixController } from "./RemixController";
import { RemixNestBuildConfig } from "./RemixNestBuildConfig";
import { BUILD_CONFIG } from "./keys";

export interface RemixNestOptions extends ModuleMetadata {
  buildConfig: RemixNestBuildConfig;
}

@Module({
  controllers: [RemixController],
})
export class RemixModule {
  static registerAsync({
    buildConfig,
    imports = [],
    providers = [],
  }: RemixNestOptions): DynamicModule {
    return {
      module: RemixModule,
      imports: imports,
      providers: [
        ...providers,
        {
          provide: BUILD_CONFIG,
          useValue: buildConfig,
        },
      ],
    };
  }
}
