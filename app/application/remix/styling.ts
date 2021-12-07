import type { LinkDescriptor, LinksFunction } from "remix";

export const link = (href: string): LinkDescriptor => ({
  rel: "stylesheet",
  href,
});

export const componentCss =
  (...descriptors: LinkDescriptor[]): LinksFunction =>
  () =>
    descriptors;
