import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import express from "express";
import { RemixModule } from "remix-bridge";

@Module({
  imports: [RemixModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const server = app.getHttpAdapter() as any;

  server
    .use(
      "/build",
      express.static("public/build", { immutable: true, maxAge: "1y" })
    )
    .use(
      "/fonts",
      express.static("public/fonts", { immutable: true, maxAge: "1y" })
    );

  await app.listen(3000);
}

bootstrap();
