const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123',10);

  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
    },
  });

  console.log(`Created user with ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });