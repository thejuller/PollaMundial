/**
 * Script para promover un usuario a ADMIN
 * Uso: node scripts/make-admin.js <email>
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin() {
    const rawEmail = process.argv[2];

    if (!rawEmail) {
        console.error('❌ Error: Debes proporcionar un email');
        console.log('Uso: node scripts/make-admin.js tu-email@ejemplo.com');
        process.exit(1);
    }

    // Normalize email to lowercase
    const email = rawEmail.toLowerCase().trim();

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        });

        console.log('✅ Usuario promovido a ADMIN exitosamente:');
        console.log(`   Email: ${user.email}`);
        console.log(`   Nombre: ${user.name || 'Sin nombre'}`);
        console.log(`   Rol: ${user.role}`);
        console.log('\n🎉 Ahora puedes acceder a /admin/scoring');
    } catch (error) {
        if (error.code === 'P2025') {
            console.error(`❌ Error: No se encontró ningún usuario con el email "${email}"`);
        } else {
            console.error('❌ Error al promover usuario:', error.message);
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

makeAdmin();
