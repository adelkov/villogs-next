import { Prisma } from '@prisma/client'

export function convertBigIntsToStrings<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (typeof obj !== 'object') {
    if (obj instanceof Prisma.Decimal || obj instanceof BigInt) {
      return String(obj) as unknown as T
    }
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntsToStrings) as unknown as T
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      convertBigIntsToStrings(value)
    ])
  ) as T
} 