import { db } from '../db';
import { userRoles, roles } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export async function assignRoleToUser(userId: string, roleName: string) {
  try {
    // Buscar el rol por nombre
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1);

    if (role.length === 0) {
      throw new Error(`Rol '${roleName}' no encontrado`);
    }

    // Verificar si el usuario ya tiene este rol
    const existingUserRole = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.roleId, role[0].id)
        )
      )
      .limit(1);

    if (existingUserRole.length > 0) {
      return { success: true, message: 'El usuario ya tiene este rol' };
    }

    // Asignar el rol al usuario
    await db.insert(userRoles).values({
      userId,
      roleId: role[0].id
    });

    return { success: true, message: 'Rol asignado correctamente' };
  } catch (error) {
    console.error('Error al asignar rol:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

export async function removeRoleFromUser(userId: string, roleName: string) {
  try {
    // Buscar el rol por nombre
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1);

    if (role.length === 0) {
      throw new Error(`Rol '${roleName}' no encontrado`);
    }

    // Eliminar la asignación del rol
    await db
      .delete(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.roleId, role[0].id)
        )
      );

    return { success: true, message: 'Rol removido correctamente' };
  } catch (error) {
    console.error('Error al remover rol:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

export async function getUserRoles(userId: string) {
  try {
    const userRolesData = await db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return { success: true, roles: userRolesData };
  } catch (error) {
    console.error('Error al obtener roles del usuario:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}