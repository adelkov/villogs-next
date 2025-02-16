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