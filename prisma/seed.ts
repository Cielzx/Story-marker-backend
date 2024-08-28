import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIM_PASS, 10);

  const findUser = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
  });

  if (findUser) {
    return console.log('User admin already exists');
  }

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL },
    update: {},
    create: {
      id: randomUUID(),
      email: process.env.ADMIN_EMAIL,
      name: 'Admin',
      password: hashedPassword,
      is_admin: true,
    },
  });

  console.log('Admin user created:', true);
}

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
