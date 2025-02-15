import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const babies = await prisma.babies.findMany({
      select: {
        id: true,
        name: true,
        date_of_birth: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    // Convert BigInt to string before serializing
    const serializedBabies = babies.map(baby => ({
      ...baby,
      id: baby.id.toString(),  // Convert BigInt to string
    }))

    return NextResponse.json(serializedBabies, { status: 200 })
  } catch (error) {
    console.error('Error fetching babies:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 