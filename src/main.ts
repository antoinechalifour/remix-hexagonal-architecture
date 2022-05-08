import path from "path";
import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { RemixModule } from "remix-nest-adapter";
import { WebModule } from "web";

@Module({
  imports: [
    RemixModule.forRoot({
      handlerModule: WebModule,
      buildConfig: {
        publicBuildFolder: path.join(__dirname, "../../public"),
        serverBuildFolder: path.join(__dirname, "../../build"),
      },
      sessionConfig: {
        name: "__session",
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        sameSite: "strict",
        secrets: [process.env.SESSION_SECRET!],
      },
    }),
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  return app.listen(process.env.PORT ?? 3000);
}

bootstrap();
