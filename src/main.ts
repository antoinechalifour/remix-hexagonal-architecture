import { NestFactory } from "@nestjs/core";
import { Controller, Get, Module } from "@nestjs/common";
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import path from "path";

@Controller()
class TestController {
  @Get("/test")
  public get() {
    return "coucou";
  }
}

@Module({
  controllers: [TestController],
})
class AppModule {}

const BUILD_DIR = path.join(process.cwd(), "build");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpAdapter() as any;

  server
    .use(
      "/build",
      express.static("public/build", { immutable: true, maxAge: "1y" })
    )
    .use(
      "/fonts",
      express.static("public/fonts", { immutable: true, maxAge: "1y" })
    )
    .all("*", (req: any, res: any, next: any) => {
      if (process.env.NODE_ENV !== "production") {
        for (let key in require.cache) {
          if (key.startsWith(BUILD_DIR)) {
            delete require.cache[key];
          }
        }
      }

      return createRequestHandler({
        // `remix build` and `remix dev` output files to a build directory, you need
        // to pass that build to the request handler
        build: require("../../build"),

        // return anything you want here to be available as `context` in your
        // loaders and actions. This is where you can bridge the gap between Remix
        // and your server
        getLoadContext(req, res) {
          return {};
        },
      })(req, res, next);
    });

  await app.listen(3000);
}
bootstrap();
