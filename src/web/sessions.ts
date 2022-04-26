import { createCookieSessionStorage, Session } from "remix";

export const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "strict",
    secrets: ["azerty"],
  },
});

export const isAuthenticatedSession = (session: Session) =>
  session.has("userId");
