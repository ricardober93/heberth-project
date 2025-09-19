import { db } from '../db';
import { roles, userRoles } from '../db/schema';
import { auth } from './config';
import { eq } from 'drizzle-orm';

export async function seedRoles() {
  try {
    const existingRoles = await db.select().from(roles);

    if (existingRoles.length === 0) {
      await db.insert(roles).values([
        {
          name: 'SUPER_ADMIN',
          description: 'Administrador con acceso completo al sistema'
        },
        {
          name: 'TEACHER',
          description: 'Profesor con permisos de gestión educativa y contenido'
        },
        {
          name: 'STUDENT',
          description: 'Estudiante con acceso a contenido educativo'
        }
      ]);

      console.log('✅ Roles inicializados correctamente');
    } else {
      console.log('ℹ️  Los roles ya existen en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error al inicializar roles:', error);
    throw error;
  }
}

export async function seedUsers() {
  try {
    // Crear usuario Super Admin
    const superAdminUser = await auth.api.signUp({
      body: {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: 'admin123'
      }
    });

    if (superAdminUser?.user) {
      await assignRoleToUser(superAdminUser.user.id, 'SUPER_ADMIN');
      console.log('✅ Usuario Super Admin creado');
    }

    // Crear usuario Teacher
    const teacherUser = await auth.api.signUp({
      body: {
        name: 'Profesor Demo',
        email: 'teacher@example.com',
        password: 'teacher123'
      }
    });

    if (teacherUser?.user) {
      await assignRoleToUser(teacherUser.user.id, 'TEACHER');
      console.log('✅ Usuario Teacher creado');
    }

    // Crear usuario Student
    const studentUser = await auth.api.signUp({
      body: {
        name: 'Estudiante Demo',
        email: 'student@example.com',
        password: 'student123'
      }
    });

    if (studentUser?.user) {
      await assignRoleToUser(studentUser.user.id, 'STUDENT');
      console.log('✅ Usuario Student creado');
    }

  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
  }
}

async function assignRoleToUser(userId: string, roleName: string) {
  const role = await db
    .select()
    .from(roles)
    .where(eq(roles.name, roleName))
    .limit(1);

  if (role.length > 0) {
    await db.insert(userRoles).values({
      userId,
      roleId: role[0].id
    });
  }
}

export async function seedDatabase() {
  console.log('🌱 Iniciando seed de la base de datos...');
  await seedRoles();
  await seedUsers();
  console.log('🌱 Seed completado');
}