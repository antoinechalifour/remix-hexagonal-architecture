import { createCookieSessionStorage, Session } from "remix";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "strict",
      secrets: [process.env.SESSION_SECRET!],
    },
  });

export const isAuthenticatedSession = (session: Session) =>
  session.has("userId");
