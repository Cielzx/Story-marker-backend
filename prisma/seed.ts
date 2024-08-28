import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { User } from '../src/modules/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL },
  });

  if (existingUser) {
    return console.log('Admin Already created');
  }

  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL },
    update: {},
    create: {
      id: uuidv4(),
      email: process.env.ADMIN_EMAIL,
      name: 'Admin',
      password: hashedPassword,
      is_admin: true,
    },
  });

  console.log('Admin user created:', plainToInstance(User, adminUser));
}

main();
