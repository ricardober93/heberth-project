import { Hono } from "hono";
import { serveStatic } from "hono/bun";

import { manager } from "./routes/manager";
import { auth } from "./routes/auth";
import { admin } from "./routes/admin";
import { user } from "./routes/user";

import { cors } from "hono/cors";
import { auth as betterAuth, type Session, type User } from "./auth/config";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

app.use("*", async (c, next) => {
  const session = await betterAuth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.use(
  "*",
  cors({
    origin: ["*", "http://localhost:5173"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

const managerRoute = app
  .basePath("/api")
  .route("/", auth)
  .route("/manager", manager)
  .route("/admin", admin)
  .route("/user", user);

app.use("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;

export type ApiManager = typeof managerRoute;
