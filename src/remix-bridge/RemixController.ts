import { All, Body, Controller, Next, Req, Res } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { createRequestHandler } from "@remix-run/express";
import { RemixNestContextLoader } from "./RemixNestContextLoader";

@Controller("*")
export class RemixController {
  constructor(
    private readonly remixNestContextLoader: RemixNestContextLoader
  ) {}

  @All()
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
      build: require("../../../build"),

      // return anything you want here to be available as `context` in your
      // loaders and actions. This is where you can bridge the gap between Remix
      // and your server
      getLoadContext: () => this.remixNestContextLoader.loadContext(),
    })(request, response, next);
  }
}
