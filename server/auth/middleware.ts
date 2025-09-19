import type { Context, Next } from 'hono';
import { auth } from './config';
import { db } from '../db';
import { userRoles, roles } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface AuthContext extends Context {
  user?: {
    id: string;
    name: string;
    email: string;
    roles?: string[];
  };
}

// Middleware de autenticación
export async function authMiddleware(c: AuthContext, next: Next) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    });

    if (!session) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    // Obtener roles del usuario
    const userRolesData = await db
      .select({
        roleName: roles.name
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, session.user.id));

    c.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      roles: userRolesData.map(r => r.roleName)
    };

    await next();
  } catch (error) {
    return c.json({ error: 'Error de autenticación' }, 401);
  }
}

// Middleware de autorización por roles
export function requireRole(...allowedRoles: string[]) {
  return async (c: AuthContext, next: Next) => {
    if (!c.user) {
      return c.json({ error: 'Usuario no autenticado' }, 401);
    }

    if (!c.user.roles) {
      return c.json({ error: 'Usuario sin roles asignados' }, 403);
    }

    const hasRole = allowedRoles.some(role =>
      c.user!.roles!.includes(role)
    );

    if (!hasRole) {
      return c.json({
        error: 'No tienes permisos para acceder a este recurso',
        requiredRoles: allowedRoles,
        userRoles: c.user.roles
      }, 403);
    }

    await next();
  };
}

// Roles disponibles
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
} as const;