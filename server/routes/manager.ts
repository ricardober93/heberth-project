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
import { asc, count, desc, eq, not } from "drizzle-orm";
import { auth } from "../auth/config";
import { paginateQuery } from "../utils/paginateQuery";

const manager = new Hono()
  .get(
    "/users",
    authMiddleware,
    requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN),
    async (c) => {
      const page = parseInt(c.req.query("page") || "1");
      const limit = parseInt(c.req.query("limit") || "10");
      const sortBy = c.req.query("sortBy") || "id";
      const sortOrder = c.req.query("sortOrder") || "desc";

      const users = await db
        .select()
        .from(userTable)
        .leftJoin(userRoles, eq(userTable.id, userRoles.userId))
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(not(eq(userRoles.roleId, 1))); // Excluye usuarios con rol 1

      try {
    // Query principal
    const query = db
      .select()
      .from(userTable)
      .orderBy(
        sortOrder === 'asc' 
          ? asc(userTable[sortBy as keyof typeof userTable._.columns] || userTable.id)
          : desc(userTable[sortBy as keyof typeof userTable._.columns] || userTable.id)
      )
    
    // Query para contar registros
    const countQuery = db
      .select({ count: count() })
      .from(userTable)
    
    // Obtener datos paginados
    const result = await paginateQuery(query, countQuery, page, limit)
    
    return c.json(result)
    
  } catch (error) {
    console.error('Error in pagination:', error)
    return c.json(
      { 
        error: 'Error fetching data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      500
    )
  }
    }
  )
  .get(
    "/",
    authMiddleware,
    requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN),
    async (c) => {
      const users = await db
        .select()
        .from(userTable)
        .leftJoin(userRoles, eq(userTable.id, userRoles.userId))
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(not(eq(userRoles.roleId, 1))); // Excluye usuarios con rol 1

      return c.json(
        {
          users,
        },
        200
      );
    }
  ) // GET /all users
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
  .post("/create", authMiddleware, async (c: AuthContext) => {
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
  }) // POST
  .post(
    "/create-user",
    authMiddleware,
    requireRole(ROLES.TEACHER, ROLES.SUPER_ADMIN),
    async (c: AuthContext) => {
      const body = (await c.req.json()) as {
        name: string;
        email: string;
        password: string;
        role: string;
      };

      const newUser = await auth.api.signUpEmail({
        body: {
          email: body.email,
          password: body.password,
          name: body.name,
        },
      });

      const rolesData = await db
        .select()
        .from(roles)
        .where(eq(roles.name, body.role));

      if (rolesData.length === 0) {
        return c.json({ error: "Rol no válido" }, 400);
      }

      await db.insert(userRoles).values({
        userId: newUser.user?.id || "",
        roleId: rolesData[0].id,
      });

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
