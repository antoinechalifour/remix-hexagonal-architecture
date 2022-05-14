import { DynamicModule, Module } from "@nestjs/common";
import path from "path";
import { RemixModule } from "remix-nest-adapter";
import { CoreModule } from "./CoreModule";

const RemixBuildConfig = {
  publicBuildFolder: path.join(__dirname, "../../../public"),
  serverBuildFolder: path.join(__dirname, "../../../build"),
};

@Module({})
export class ApplicationModule {
  static registerAsync(): DynamicModule {
    return {
      module: ApplicationModule,
      providers: [],
      imports: [
        RemixModule.registerAsync({
          buildConfig: RemixBuildConfig,
          imports: [CoreModule],
        }),
      ],
    };
  }
}
