import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email }
    })

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive password reset instructions.'
      })
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex')

    // Store reset token in database
    await prisma.password_reset_tokens.upsert({
      where: { email },
      update: {
        token,
        created_at: new Date()
      },
      create: {
        email,
        token,
        created_at: new Date()
      }
    })

    // For local development, use the request URL to construct the reset URL
    const baseUrl = request.nextUrl.origin
    const resetUrl = `${baseUrl}/reset-password?token=${token}`
    
    // Log the reset link to console
    await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive password reset instructions.'
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 