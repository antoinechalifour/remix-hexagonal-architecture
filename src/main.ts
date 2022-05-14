import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "web";

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule.registerAsync(), {
    bodyParser: false,
  });

  return app.listen(process.env.PORT ?? 3000);
}

bootstrap();
