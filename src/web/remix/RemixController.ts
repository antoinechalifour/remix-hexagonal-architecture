import { All, Body, Controller, Inject, Next, Req, Res } from "@nestjs/common";
import { createRequestHandler } from "@remix-run/express";
import { NextFunction, Request, Response } from "express";
import { ACTIONS_CLASS, LOADERS_CLASS, REMIX_HANDLER } from "../../keys";

@Controller("/")
export class RemixController {
  constructor(
    @Inject(REMIX_HANDLER) private readonly remixHandlerPath: string,
    @Inject(ACTIONS_CLASS) private readonly actions: unknown,
    @Inject(LOADERS_CLASS) private readonly loaders: unknown
  ) {}

  @All("*")
  handler(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction,
    @Body() body: any
  ) {
    if (this.isStaticAsset(request)) return next();
    this.purgeRequireCacheInDev();

    return createRequestHandler({
      // `remix build` and `remix dev` output files to a build directory, you need
      // to pass that build to the request handler
      build: require(this.remixHandlerPath),

      // return anything you want here to be available as `context` in your
      // loaders and actions. This is where you can bridge the gap between Remix
      // and your server
      getLoadContext: () => ({
        actions: this.actions,
        loaders: this.loaders,
      }),
    })(request, response, next);
  }

  private purgeRequireCacheInDev() {
    if (process.env.NODE_ENV === "production") return;

    for (let key in require.cache) {
      if (key.startsWith(this.remixHandlerPath)) {
        delete require.cache[key];
      }
    }
  }

  private isStaticAsset(request: Request) {
    return /^\/(build|assets)\//gi.test(request.url);
  }
}
