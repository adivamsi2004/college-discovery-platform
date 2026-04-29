import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In Vercel, the file system is read-only except for /tmp.
  // SQLite needs to create a .journal file even for reading.
  // So we copy the DB to /tmp where it can be safely used.
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const tmpDbPath = '/tmp/dev.db';

  if (!fs.existsSync(tmpDbPath)) {
    try {
      fs.copyFileSync(dbPath, tmpDbPath);
    } catch (e) {
      console.error('Failed to copy db to /tmp', e);
    }
  }

  prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: 'file:/tmp/dev.db',
      },
    },
  });
} else {
  const globalForPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
  };
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ log: ['query', 'error'] });
  }
  prismaClient = globalForPrisma.prisma;
}

export const prisma = prismaClient;
