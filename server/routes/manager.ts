import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  authMiddleware,
  requireRole,
  ROLES,
  type AuthContext,
} from "../auth/middleware";

import { db } from "../db";
import { roles, userRoles, user as userTable } from "../db/schema";
import { eq, not } from "drizzle-orm";
import { auth } from "../auth/config";

const manager = new Hono()
  .get(
    "/",
    authMiddleware,
    requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN),
    async (c) => {
      
      const users = await db
        .select()
        .from(userTable)
        .leftJoin(
          userRoles,
          eq(userTable.id, userRoles.userId)
        )
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(not(eq(userRoles.roleId, 1))); // Excluye usuarios con rol 1

      // Si quieres excluir explícitamente a los super_admin:
      // .where(neq(userRoles.roleId, ROLES.SUPER_ADMIN))
      return c.json(
        {
          users,
        },
        200
      );
    }
  ) // GET /book
  .get(
    "/:id{[0-9]+}",
    authMiddleware,
    requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN),
    async (c: AuthContext) => {
      // GET /manager/:id
      const id = c.req.param("id");
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id));

      if (!user) {
        return c.status(404);
      }
      return c.json(
        {
          user,
        },
        200
      );
    }
  )
  .post(
    "/create",
    authMiddleware,
    requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN),
    async (c: AuthContext) => {
      const body = await c.req.json();

      const newUser = await auth.api.signUpEmail({
        body: {
          email: body.email,
          password: body.password,
          name: body.name,
        },
      });

      await db
        .update(userRoles)
        .set({
          userId: newUser.user?.id || "",
          roleId: 1,
        })
        .where(eq(userTable.id, newUser.user?.id));

      return c.json(
        {
          newUser,
        },
        200
      );
    }
  ) // POST
  .put(
    "/:id{[0-9]+}",
    authMiddleware,
    requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN),
    async (c: AuthContext) => {
      const id = c.req.param("id");
      const body = await c.req.json();

      const note = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id));

      if (!note) {
        return c.status(404);
      }
      const updateUser = await db
        .update(userTable)
        .set({
          name: body.name,
          email: body.email,
        })
        .where(eq(userTable.id, id));
      return c.json(
        {
          updateUser,
        },
        200
      );
    }
  ) // PUT
  .delete(
    "/:id",
    authMiddleware,
    requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN),
    async (c: AuthContext) => {
      const id = c.req.param("id");

      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id));

      if (!user) {
        return c.status(404);
      }

      const userDelete = await db.delete(userTable).where(eq(userTable.id, id));

      return c.json(
        {
          userDelete,
        },
        200
      );
    }
  ); // DELETE

export { manager };
