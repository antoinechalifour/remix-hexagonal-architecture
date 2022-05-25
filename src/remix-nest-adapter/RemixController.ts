import path from "path";
import {
  All,
  Body,
  Controller,
  Get,
  Inject,
  Next,
  Req,
  Res,
} from "@nestjs/common";
import express, { NextFunction, Request, Response } from "express";
import { createRequestHandler } from "@remix-run/express";
import { RemixNestBuildConfig } from "./RemixNestBuildConfig";
import { ACTIONS_CLASS, BUILD_CONFIG, LOADERS_CLASS } from "./keys";

@Controller("/")
export class RemixController {
  private readonly staticMiddleware;

  constructor(
    @Inject(BUILD_CONFIG) private readonly configuration: RemixNestBuildConfig,
    @Inject(ACTIONS_CLASS) private readonly actions: unknown,
    @Inject(LOADERS_CLASS) private readonly loaders: unknown
  ) {
    this.staticMiddleware = express.static(
      this.configuration.publicBuildFolder,
      {
        immutable: true,
        maxAge: "1y",
      }
    );
  }

  @Get("/build/*")
  serveBuild(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction
  ) {
    return this.staticMiddleware(request, response, next);
  }

  @Get("/assets/*")
  serveFonts(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction
  ) {
    return this.staticMiddleware(request, response, next);
  }

  @All("*")
  handler(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction,
    @Body() body: any
  ) {
    if (process.env.NODE_ENV !== "production") {
      const BUILD_DIR = path.join(process.cwd(), "build");

      for (let key in require.cache) {
        if (key.startsWith(BUILD_DIR)) {
          delete require.cache[key];
        }
      }
    }

    return createRequestHandler({
      // `remix build` and `remix dev` output files to a build directory, you need
      // to pass that build to the request handler
      build: require(this.configuration.serverBuildFolder),

      // return anything you want here to be available as `context` in your
      // loaders and actions. This is where you can bridge the gap between Remix
      // and your server
      getLoadContext: () => ({
        actions: this.actions,
        loaders: this.loaders,
      }),
    })(request, response, next);
  }
}
