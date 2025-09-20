import { Hono } from "hono";
import { auth as betterAuth } from "../auth/config";
import { authMiddleware, ROLES } from "../auth/middleware";
import { assignRoleToUser, getUserRoles } from "../auth/utils";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { roles, userRoles } from "../db/schema";
import { eq } from "drizzle-orm";

// Esquemas de validación
const signUpSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum([ROLES.SUPER_ADMIN, ROLES.TEACHER, ROLES.STUDENT]).optional(),
});

// Rutas de autenticación usando better-auth
const auth = new Hono()
  .post(
    "/register",
    zValidator("json", signUpSchema),
    async (c) => {
      try {
        const { email, password, role } = c.req.valid("json");

        // Crear usuario usando better-auth
        const result = await betterAuth.api.signInEmail({
          body: {
            email,
            password,
          },
        });

        if (!result?.user) {
          return c.json({ error: "Error al crear el usuario" }, 400);
        }

        // Asignar rol si se especifica, sino asignar STUDENT por defecto
        const userRole = role || ROLES.STUDENT;
        const roleResult = await assignRoleToUser(result.user.id, userRole);

        if (!roleResult.success) {
          console.error("Error al asignar rol:", roleResult.error);
        }

        return c.json({
          success: true,
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: userRole,
          },
        });
      } catch (error) {
        console.error("Error en registro:", error);
        return c.json({ error: "Error interno del servidor" }, 500);
      }
    } // Ruta para obtener información del usuario actual
  )
  .get("/roles", async (c) => {
    const rolesData = await db.select().from(roles);

    return c.json({
      rolesData,
    });
  })
  .get("/me", authMiddleware, async (c) => {
    const session = c.get("session");
    const user = c.get("user");

    // Obtener los nombres de los roles del usuario
    const userRolesResult = await db
      .select({ roleName: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));

    const userRol = userRolesResult.map((r) => r.roleName);

    if (!user) return c.body(null, 401);
    return c.json({
      session,
      user: { ...user, roles: userRol },
    });
  })
  .on(["POST", "GET"], "*", (c) => {
    return betterAuth.handler(c.req.raw);
  });

export { auth };
