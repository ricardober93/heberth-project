
import { Hono } from "hono";
import { auth as betterAuth } from "../auth/config";
import { authMiddleware, ROLES } from "../auth/middleware";
import { assignRoleToUser, getUserRoles } from "../auth/utils";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";



// Esquemas de validación
const signUpSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum([ROLES.SUPER_ADMIN, ROLES.TEACHER, ROLES.STUDENT]).optional()
});

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida")
});
export const auth = new Hono()
// Rutas de autenticación usando better-auth
.all('/api/auth/**', async (c) => {
  return betterAuth.handler(c.req.raw);
})
.post('/register',
  zValidator('json', signUpSchema),
  async (c) => {
    try {
      const { email, password, role } = c.req.valid('json');

      // Crear usuario usando better-auth
      const result = await betterAuth.api.signInEmail({
        body: {
          email,
          password
        }
      });

      if (!result?.user) {
        return c.json({ error: 'Error al crear el usuario' }, 400);
      }

      // Asignar rol si se especifica, sino asignar STUDENT por defecto
      const userRole = role || ROLES.STUDENT;
      const roleResult = await assignRoleToUser(result.user.id, userRole);

      if (!roleResult.success) {
        console.error('Error al asignar rol:', roleResult.error);
      }

      return c.json({
        success: true,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: userRole
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      return c.json({ error: 'Error interno del servidor' }, 500);
    }
  }
)

// Ruta para obtener información del usuario actual
.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  return c.json({
    user: {
      id: user!.id,
      name: user!.name,
      email: user!.email,
      roles: user!.roles
    }
  });
})

// Ruta para obtener todos los roles disponibles
.get('/roles', async (c) => {
  return c.json({
    roles: Object.values(ROLES)
  });
});
