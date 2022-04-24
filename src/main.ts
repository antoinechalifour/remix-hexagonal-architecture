import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { RemixModule } from "remix-bridge";

@Module({
  imports: [RemixModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  return app.listen(process.env.PORT ?? 3000);
}

bootstrap();
