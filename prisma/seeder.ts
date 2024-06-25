import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function seedSalesmen() {
  try {
    const salesmanData = [
      { name: 'Salesman 1' },
      { name: 'Salesman 2' },
      { name: 'Salesman 3' },
      { name: 'Salesman 4' },
      { name: 'Salesman 5' },
    ];

    for (const data of salesmanData) {
      await prisma.salesman.create({
        data,
      });
    }

    console.log('Seeder: Salesman data seeded successfully');
  } catch (error) {
    console.error('Seeder: Error seeding salesman data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSalesmen()
  .catch((error) => {
    console.error('Seeder: Error in seedSalesmen function:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
