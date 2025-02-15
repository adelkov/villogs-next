import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const now = new Date().toISOString()
    
    // Check if there's an ongoing sleep
    const ongoingSleep = await prisma.sleep_logs.findFirst({
      where: {
        baby_id: BigInt(params.id),
        ended_at: null
      }
    })

    if (ongoingSleep) {
      // End the sleep
      const updatedSleep = await prisma.sleep_logs.update({
        where: { id: ongoingSleep.id },
        data: { ended_at: now }
      })
      return NextResponse.json(updatedSleep)
    } else {
      // Start new sleep
      const newSleep = await prisma.sleep_logs.create({
        data: {
          baby_id: BigInt(params.id),
          started_at: now,
        }
      })
      return NextResponse.json(newSleep)
    }
  } catch (error) {
    console.error('Error managing sleep:', error)
    return NextResponse.json(
      { error: 'Failed to manage sleep' },
      { status: 500 }
    )
  }
} 