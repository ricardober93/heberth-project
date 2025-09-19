#!/usr/bin/env bun

import { seedDatabase } from '../auth/seed';

async function main() {
  console.log('🚀 Iniciando configuración de la base de datos...');

  try {
    await seedDatabase();
    console.log('✅ Base de datos configurada correctamente');

    console.log('\n📋 Usuarios de ejemplo creados:');
    console.log('👤 Super Admin: admin@example.com (contraseña: admin123)');
    console.log('👨‍🏫 Teacher: teacher@example.com (contraseña: teacher123)');
    console.log('👨‍🎓 Student: student@example.com (contraseña: student123)');

  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error);
    process.exit(1);
  }
}

main();