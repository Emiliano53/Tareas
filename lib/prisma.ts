import { PrismaClient } from '@prisma/client'

// Evita múltiples instancias de Prisma en desarrollo
declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma
}

export default prisma