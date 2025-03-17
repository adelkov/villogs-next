import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Find the reset token
    const resetToken = await prisma.password_reset_tokens.findFirst({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token is expired (1 hour)
    const tokenAge = Date.now() - resetToken.created_at.getTime()
    if (tokenAge > 3600000) { // 1 hour in milliseconds
      await prisma.password_reset_tokens.delete({
        where: { email: resetToken.email }
      })
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12)

    // Update user's password
    await prisma.users.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword }
    })

    // Delete the used token
    await prisma.password_reset_tokens.delete({
      where: { email: resetToken.email }
    })

    return NextResponse.json({
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 