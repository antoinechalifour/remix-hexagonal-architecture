import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";
import { RemixController } from "./RemixController";
import { RemixNestBuildConfig } from "./RemixNestBuildConfig";
import { BUILD_CONFIG } from "./keys";

export interface RemixNestOptions extends ModuleMetadata {
  buildConfig: RemixNestBuildConfig;
}

@Module({})
export class RemixModule {
  static registerAsync({
    buildConfig,
    imports = [],
    controllers = [],
    providers = [],
    exports = [],
  }: RemixNestOptions): DynamicModule {
    return {
      module: RemixModule,
      imports: imports,
      controllers: [...controllers, RemixController],
      providers: [
        ...providers,
        {
          provide: BUILD_CONFIG,
          useValue: buildConfig,
        },
      ],
      exports: exports,
    };
  }
}
