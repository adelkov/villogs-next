import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export type AuthenticatedAction<TArgs extends any[], TReturn> = (...args: TArgs) => Promise<TReturn>

export function withAuth<TArgs extends any[], TReturn>(
  action: (session: NonNullable<Awaited<ReturnType<typeof auth>>>, ...args: TArgs) => Promise<TReturn>
): AuthenticatedAction<TArgs, TReturn> {
  return async (...args) => {
    const session = await auth()
    
    if (!session) {
      redirect('/login')
    }
    
    return action(session, ...args)
  }
} 