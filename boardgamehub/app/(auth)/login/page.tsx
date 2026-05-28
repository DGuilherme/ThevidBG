import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  const safeRedirect =
    redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/'
  return <LoginForm redirect={safeRedirect} />
}
