import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export function convertBigIntsToStrings<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj === 'bigint') {
    return obj.toString() as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntsToStrings(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const converted: Record<string, unknown> = {}
    
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntsToStrings(value)
    }

    return converted as T
  }

  return obj
} 