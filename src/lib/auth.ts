import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { Session } from 'next-auth'

export type AuthenticatedAction<Args extends unknown[], Return> = (...args: Args) => Promise<Return>

export function withAuth<Args extends unknown[], Return>(
  action: (session: Session, ...args: Args) => Promise<Return>
): AuthenticatedAction<Args, Return> {
  return async (...args) => {
    const session = await auth()
    
    if (!session) {
      redirect('/login')
    }
    
    return action(session, ...args)
  }
} 