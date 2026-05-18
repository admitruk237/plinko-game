import { redirect } from 'next/navigation'
import { getRefreshToken } from '@/shared/lib/session'

export default async function HomePage() {
  const refreshToken = await getRefreshToken()
  redirect(refreshToken ? '/game' : '/login')
}
