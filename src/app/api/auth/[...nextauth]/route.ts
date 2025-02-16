import NextAuth from 'next-auth'
import { authConfig } from '@/auth'

export const runtime = 'nodejs'

const auth = NextAuth(authConfig)

// Export the auth handlers directly
export const { GET, POST } = auth.handlers