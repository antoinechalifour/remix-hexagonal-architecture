import path from "path";
import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "web";

const session = {
  name: "__session",
  maxAge: 60 * 60 * 24,
  httpOnly: true,
  sameSite: "strict" as const,
  secrets: [process.env.SESSION_SECRET!],
};

async function bootstrap() {
  const app = await NestFactory.create(
    ApplicationModule.register({
      session,
      remixHandlerPath: path.join(__dirname, "../../build"),
    }),
    {
      bodyParser: false,
    }
  );

  return app.listen(process.env.PORT ?? 3000);
}

bootstrap();
