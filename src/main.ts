import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { RemixModule } from "remix-bridge";
import path from "path";

@Module({
  imports: [
    RemixModule.forRoot({
      publicBuildFolder: path.join(__dirname, "../public"),
      serverBuildFolder: path.join(__dirname, "../build"),
    }),
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  return app.listen(process.env.PORT ?? 3000);
}

bootstrap();
