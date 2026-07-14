import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { PERMISSIONS } from '../src/shared/constants/permissions.constant';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Seed Permissions
  const permissionIds: Record<string, number> = {};
  for (const [key, actionCode] of Object.entries(PERMISSIONS)) {
    const permission = await prisma.permissions.upsert({
      where: { action_code: actionCode },
      update: {},
      create: {
        action_code: actionCode,
        description: `Quyền ${actionCode}`,
      },
    });
    permissionIds[actionCode] = permission.id;
  }
  console.log('✔ Permissions seeded.');

  // 2. Seed Roles
  const adminRole = await prisma.roles.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const employeeRole = await prisma.roles.upsert({
    where: { name: 'employee' },
    update: {},
    create: { name: 'employee' },
  });
  console.log('✔ Roles seeded.');

  // 3. Map Permissions to Admin Role (All Permissions)
  for (const pId of Object.values(permissionIds)) {
    await prisma.role_permissions.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: pId,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: pId,
      },
    });
  }

  // 4. Map Permissions to Employee Role (Basic permissions)
  const employeePermissions = [
    PERMISSIONS.VIEW_FORM,
    PERMISSIONS.SUBMIT_FORM,
    PERMISSIONS.VIEW_SUBMISSIONS,
  ];
  for (const actionCode of employeePermissions) {
    const pId = permissionIds[actionCode];
    await prisma.role_permissions.upsert({
      where: {
        role_id_permission_id: {
          role_id: employeeRole.id,
          permission_id: pId,
        },
      },
      update: {},
      create: {
        role_id: employeeRole.id,
        permission_id: pId,
      },
    });
  }
  console.log('✔ Role Permissions mapped.');

  // 5. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('123456', 10);
  const adminUser = await prisma.users.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@gmail.com',
      password_hash: adminPasswordHash,
      is_active: true,
    },
  });

  // Assign Admin role to Admin User
  await prisma.user_roles.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: adminRole.id,
      },
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: adminRole.id,
    },
  });
  console.log('✔ Admin user (admin@gmail.com / 123456) seeded successfully.');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
