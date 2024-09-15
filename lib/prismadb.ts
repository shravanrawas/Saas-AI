import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientType } from '@prisma/client';

interface GlobalWithPrisma extends NodeJS.Global {
  prisma?: PrismaClientType;
}


const globalWithPrisma = global as GlobalWithPrisma;

const prismadb = globalWithPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalWithPrisma.prisma = prismadb;
}

export default prismadb;
