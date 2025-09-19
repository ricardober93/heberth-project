import { Hono } from "hono";
import { authMiddleware, requireRole, ROLES } from "../auth/middleware";
import { assignRoleToUser, removeRoleFromUser, getUserRoles } from "../auth/utils";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db";
import { user, userRoles, roles } from "../db/schema";
import { eq } from "drizzle-orm";

export const admin = new Hono()

// Esquemas de validación
const assignRoleSchema = z.object({
  userId: z.string(),
  roleName: z.enum([ROLES.SUPER_ADMIN, ROLES.TEACHER, ROLES.STUDENT])
});

// Aplicar middleware de autenticación y autorización a todas las rutas
admin.use('*', authMiddleware);
admin.use('*', requireRole(ROLES.SUPER_ADMIN))

// Obtener todos los usuarios con sus roles
.get('/users', async (c) => {
  try {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user);

    const usersWithRoles = await Promise.all(
      users.map(async (userData) => {
        const userRolesResult = await getUserRoles(userData.id);
        return {
          ...userData,
          roles: userRolesResult.success ? userRolesResult.roles : []
        };
      })
    );

    return c.json({ users: usersWithRoles });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
})

// Asignar rol a usuario
.post('/users/:userId/assign-role',
  zValidator('json', z.object({ roleName: z.enum([ROLES.SUPER_ADMIN, ROLES.TEACHER, ROLES.STUDENT]) })),
  async (c) => {
    try {
      const userId = c.req.param('userId');
      const { roleName } = c.req.valid('json');

      const result = await assignRoleToUser(userId, roleName);

      if (result.success) {
        return c.json({ success: true, message: result.message });
      } else {
        return c.json({ error: result.error }, 400);
      }
    } catch (error) {
      console.error('Error al asignar rol:', error);
      return c.json({ error: 'Error interno del servidor' }, 500);
    }
  }
)

// Remover rol de usuario
.delete('/users/:userId/remove-role',
  zValidator('json', z.object({ roleName: z.enum([ROLES.SUPER_ADMIN, ROLES.TEACHER, ROLES.STUDENT]) })),
  async (c) => {
    try {
      const userId = c.req.param('userId');
      const { roleName } = c.req.valid('json');

      const result = await removeRoleFromUser(userId, roleName);

      if (result.success) {
        return c.json({ success: true, message: result.message });
      } else {
        return c.json({ error: result.error }, 400);
      }
    } catch (error) {
      console.error('Error al remover rol:', error);
      return c.json({ error: 'Error interno del servidor' }, 500);
    }
  }
)

// Obtener roles de un usuario específico
.get('/users/:userId/roles', async (c) => {
  try {
    const userId = c.req.param('userId');
    const result = await getUserRoles(userId);

    if (result.success) {
      return c.json({ roles: result.roles });
    } else {
      return c.json({ error: result.error }, 400);
    }
  } catch (error) {
    console.error('Error al obtener roles del usuario:', error);
    return c.json({ error: 'Error interno del servidor' }, 500);
  }
});