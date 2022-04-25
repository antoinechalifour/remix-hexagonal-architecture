import path from "path";
import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { RemixModule } from "remix-nest-adapter";
import { WebModule } from "web";

@Module({
  imports: [
    RemixModule.forRoot({
      buildConfig: {
        publicBuildFolder: path.join(__dirname, "../public"),
        serverBuildFolder: path.join(__dirname, "../build"),
      },
      handlerModule: WebModule,
    }),
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  return app.listen(process.env.PORT ?? 3000);
}

bootstrap();
